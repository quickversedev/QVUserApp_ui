import React, { useMemo, useState } from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { CATALOGUE_ACCENT, CATALOGUE_GUTTER } from '../../../constants/catalogue';
import { useTheme } from '../../../theme/ThemeContext';
import { ThemeText } from '../../common/theme/ThemeText';

/**
 * Delivery-partner tip.
 *
 * ⚠️ **The tip is not charged and not paid out.** No tip field exists anywhere in the
 * stack: not on the cart, not in the checkout-summary request or response, and not in
 * `CreateOrderRequest`. Selecting one here changes the totals this app *displays*
 * while the amount actually charged stays the server's `payableAmount`, which excludes
 * it — so the customer is shown a number they will not be charged, and the delivery
 * partner receives nothing.
 *
 * Built to the design at the product owner's explicit request after that was raised.
 * `TIP_IS_CHARGEABLE` is the single switch that contains the damage: while it is
 * false the tip is never added to any displayed total, so the screen stays truthful
 * and the picker is inert. Flip it to true only once the backend accepts and settles a
 * tip — see QV-17 in TICKETS-2026-09-08.md, which is a launch blocker for production.
 */
export const TIP_IS_CHARGEABLE = false;

/**
 * What a tip selection contributes to a displayed total. Zero until the backend can
 * actually carry it, so the bill and the sticky bar keep matching the charge.
 */
export const tipContribution = (tip: number): number => (TIP_IS_CHARGEABLE ? tip : 0);

const PRESETS = [10, 20, 30];

interface TipSelectorProps {
  tip: number;
  onChange: (tip: number) => void;
}

const TipSelector: React.FC<TipSelectorProps> = ({ tip, onChange }) => {
  const { getColor, theme } = useTheme();
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          marginHorizontal: CATALOGUE_GUTTER,
          marginTop: 14,
          backgroundColor: getColor('white'),
          borderRadius: 16,
          padding: 14,
          gap: 10,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: getColor('border'),
          shadowColor: theme.colors.shadow.color,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: theme.colors.shadow.opacity,
          shadowRadius: 3,
          elevation: 2,
        },
        head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
        headIcon: {
          width: 32,
          height: 32,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${getColor('primary')}1F`,
        },
        title: { fontSize: 12, lineHeight: 16, fontWeight: '700', color: getColor('text') },
        subtitle: { fontSize: 11, lineHeight: 14, color: getColor('subText') },
        row: { flexDirection: 'row', gap: 8 },
        option: {
          flex: 1,
          paddingVertical: 9,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: getColor('border'),
          backgroundColor: getColor('overlay'),
        },
        optionActive: { backgroundColor: CATALOGUE_ACCENT, borderColor: CATALOGUE_ACCENT },
        optionText: { fontSize: 12, lineHeight: 16, fontWeight: '700', color: getColor('text') },
        optionTextActive: { color: getColor('white') },
        modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
        },
        modalCard: {
          width: '100%',
          backgroundColor: getColor('white'),
          borderRadius: 16,
          padding: 20,
          gap: 12,
        },
        input: {
          borderWidth: 1,
          borderColor: getColor('border'),
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 16,
          color: getColor('text'),
        },
        modalRow: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
        modalBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
        modalConfirm: { backgroundColor: CATALOGUE_ACCENT },
      }),
    [getColor, theme]
  );

  const isCustom = tip > 0 && !PRESETS.includes(tip);

  const select = (value: number) => onChange(tip === value ? 0 : value);

  const confirmCustom = () => {
    const parsed = Number(customText.replace(/[^0-9]/g, ''));
    onChange(Number.isFinite(parsed) && parsed > 0 ? parsed : 0);
    setCustomOpen(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.headIcon}>
          <MaterialCommunityIcons name="hand-heart-outline" size={18} color={getColor('primary')} />
        </View>
        <View>
          <ThemeText style={styles.title}>Tip your delivery partner</ThemeText>
          <ThemeText style={styles.subtitle}>100% goes to your delivery champion</ThemeText>
        </View>
      </View>

      <View style={styles.row}>
        {PRESETS.map(value => {
          const active = tip === value;
          return (
            <TouchableOpacity
              key={value}
              style={[styles.option, active && styles.optionActive]}
              onPress={() => select(value)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <ThemeText style={[styles.optionText, active && styles.optionTextActive]}>
                ₹{value}
              </ThemeText>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={[styles.option, isCustom && styles.optionActive]}
          onPress={() => {
            setCustomText(isCustom ? String(tip) : '');
            setCustomOpen(true);
          }}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityState={{ selected: isCustom }}
        >
          <ThemeText style={[styles.optionText, isCustom && styles.optionTextActive]}>
            {isCustom ? `₹${tip}` : 'Custom'}
          </ThemeText>
        </TouchableOpacity>
      </View>

      <Modal
        visible={customOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCustomOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ThemeText variant="subtitle" color={getColor('text')}>
              Add a tip
            </ThemeText>
            <TextInput
              style={styles.input}
              value={customText}
              onChangeText={setCustomText}
              keyboardType="number-pad"
              placeholder="Amount in ₹"
              placeholderTextColor={getColor('placeholder')}
              autoFocus
            />
            <View style={styles.modalRow}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setCustomOpen(false)}>
                <ThemeText color={getColor('subText')}>Cancel</ThemeText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalConfirm]}
                onPress={confirmCustom}
              >
                <ThemeText color={getColor('white')}>Add tip</ThemeText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TipSelector;
