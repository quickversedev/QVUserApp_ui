import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { CATALOGUE_ACCENT, CATALOGUE_GUTTER } from '../../../constants/catalogue';
import { useTheme } from '../../../theme/ThemeContext';
import { ThemeText } from '../../common/theme/ThemeText';

/**
 * Delivery instruction chips.
 *
 * ⚠️ Presentational only. There is nowhere to send these: the cart has no instructions
 * field, `CreateOrderRequest` has none, and the only `specialInstructions` in the repo
 * is an unused property on the `Order` type plus an empty string in mock data. A
 * selection made here reaches the customer's screen and nothing else.
 *
 * Built to the design on request, with that limitation understood. Wiring it needs a
 * backend field first — see QV-18 in TICKETS-2026-09-08.md. When one exists, lift
 * `selected` into the order payload; the component already reports every change.
 */

export const DELIVERY_INSTRUCTIONS = [
  { id: 'no-bell', label: 'Avoid ringing bell', icon: 'bell-off-outline' },
  { id: 'at-door', label: 'Leave at door', icon: 'door-closed' },
  { id: 'pet', label: 'Pet at home', icon: 'paw-outline' },
] as const;

export type DeliveryInstructionId = (typeof DELIVERY_INSTRUCTIONS)[number]['id'];

interface DeliveryInstructionsProps {
  selected: DeliveryInstructionId[];
  onToggle: (id: DeliveryInstructionId) => void;
}

const DeliveryInstructions: React.FC<DeliveryInstructionsProps> = ({ selected, onToggle }) => {
  const { getColor } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: { marginTop: 14 },
        heading: {
          marginHorizontal: CATALOGUE_GUTTER,
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '700',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: getColor('subText'),
          marginBottom: 8,
        },
        // The row scrolls rather than wrapping, so a fourth chip never reflows the card.
        row: { paddingHorizontal: CATALOGUE_GUTTER, gap: 8, flexDirection: 'row' },
        chip: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 9,
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: getColor('border'),
          backgroundColor: getColor('white'),
        },
        chipActive: {
          backgroundColor: CATALOGUE_ACCENT,
          borderColor: CATALOGUE_ACCENT,
        },
        label: { fontSize: 12, lineHeight: 16, color: getColor('text') },
        labelActive: { color: getColor('white'), fontWeight: '700' },
      }),
    [getColor]
  );

  return (
    <View style={styles.section}>
      <ThemeText style={styles.heading}>Delivery Instructions</ThemeText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {DELIVERY_INSTRUCTIONS.map(item => {
          const active = selected.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onToggle(item.id)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={item.label}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={16}
                color={active ? getColor('white') : getColor('subText')}
              />
              <ThemeText style={[styles.label, active && styles.labelActive]}>
                {item.label}
              </ThemeText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default DeliveryInstructions;
