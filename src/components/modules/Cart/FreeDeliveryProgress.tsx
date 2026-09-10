import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { CATALOGUE_ACCENT, CATALOGUE_GUTTER } from '../../../constants/catalogue';
import { useTheme } from '../../../theme/ThemeContext';
import { ThemeText } from '../../common/theme/ThemeText';

/**
 * Progress toward the cart's free-delivery threshold.
 *
 * The caller decides the threshold — see `freeDeliveryThreshold` in CartScreen. In
 * practice it comes from the shop's free-delivery coupon, because the cart's own
 * `freeDeliveryAboveAmount` is a SmartBiz field our backend never populates and is
 * absent on live carts.
 *
 * Nothing is invented: with no threshold the card disappears entirely, as it does once
 * the cart has cleared the bar and the free delivery is already won.
 */
interface FreeDeliveryProgressProps {
  /** Cart subtotal to compare against the threshold. */
  cartAmount: number;
  /** From the cart response; 0 or undefined means the shop offers no threshold. */
  threshold?: number;
}

const FreeDeliveryProgress: React.FC<FreeDeliveryProgressProps> = ({ cartAmount, threshold }) => {
  const { getColor, theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          marginHorizontal: CATALOGUE_GUTTER,
          marginTop: 14,
          backgroundColor: getColor('white'),
          borderRadius: 16,
          padding: 12,
          gap: 8,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: getColor('border'),
          shadowColor: theme.colors.shadow.color,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: theme.colors.shadow.opacity,
          shadowRadius: 3,
          elevation: 2,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        },
        left: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
        progressLabel: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '700',
          color: getColor('text'),
        },
        remaining: {
          fontSize: 11,
          lineHeight: 14,
          fontWeight: '800',
          color: CATALOGUE_ACCENT,
          flexShrink: 1,
          textAlign: 'right',
        },
        track: {
          height: 8,
          borderRadius: 999,
          backgroundColor: getColor('overlay'),
          overflow: 'hidden',
        },
        fill: {
          height: '100%',
          borderRadius: 999,
          backgroundColor: CATALOGUE_ACCENT,
        },
      }),
    [getColor, theme]
  );

  // No threshold offered, or it is already met — either way there is nothing to chase.
  if (!threshold || threshold <= 0 || cartAmount >= threshold) return null;

  const remaining = Math.max(0, threshold - cartAmount);
  const pct = Math.max(0, Math.min(100, (cartAmount / threshold) * 100));

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          <MaterialCommunityIcons name="truck-fast-outline" size={18} color={CATALOGUE_ACCENT} />
          <ThemeText style={styles.progressLabel}>
            Cart ₹{Math.round(cartAmount)} / ₹{Math.round(threshold)}
          </ThemeText>
        </View>
        <ThemeText style={styles.remaining} numberOfLines={2}>
          Add ₹{Math.round(remaining)} more for FREE DELIVERY
        </ThemeText>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
};

export default FreeDeliveryProgress;
