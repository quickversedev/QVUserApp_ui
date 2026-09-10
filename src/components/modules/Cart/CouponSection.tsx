import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CATALOGUE_ACCENT, CATALOGUE_GUTTER } from '../../../constants/catalogue';
import { useTheme } from '../../../theme/ThemeContext';
import { ThemeText } from '../../common/theme/ThemeText';

/**
 * Coupons in the QV Cart design: a heading with "View All", then a green-bordered card
 * per applied coupon and a muted row prompting the ones still available.
 *
 * Applying is not done here — tapping through goes to CouponsScreen, and the discount
 * itself is computed server-side when the coupon id reaches checkout-summary. This
 * component only reflects what is selected.
 *
 * The design shows a "Saved ₹25" badge on the applied card. That number is only
 * knowable for a FIXED coupon; a percentage's real saving depends on the basket and
 * its cap, and the authoritative figure arrives as `couponDiscount` on the summary,
 * which this component is not given. So the badge states the coupon's own terms
 * ("Flat ₹50 OFF", "10% OFF") rather than a total it would have to guess at.
 */

interface AvailableCoupon {
  id: string;
  code: string;
  mov: number;
  discountValue: number | null;
  type: string;
  uptoValue: number | null;
}

interface CouponSectionProps {
  couponLoading: boolean;
  availableCoupons: AvailableCoupon[];
  selectedDiscountCoupon: AvailableCoupon | null;
  selectedDeliveryCoupon: AvailableCoupon | null;
  onCouponNavigation: () => void;
  onRemoveDiscountCoupon: () => void;
  onRemoveDeliveryCoupon: () => void;
}

const getBenefitLabel = (coupon: AvailableCoupon): string => {
  if (coupon.type === 'FREE_DELIVERY') return 'Free Delivery';
  if (coupon.type === 'FIXED' && coupon.discountValue != null) {
    return `Flat ₹${coupon.discountValue} OFF`;
  }
  if (coupon.type === 'PERCENTAGE' && coupon.discountValue != null) {
    return coupon.uptoValue
      ? `${coupon.discountValue}% OFF up to ₹${coupon.uptoValue}`
      : `${coupon.discountValue}% OFF`;
  }
  return 'Applied';
};

const CouponSection: React.FC<CouponSectionProps> = ({
  couponLoading,
  availableCoupons,
  selectedDiscountCoupon,
  selectedDeliveryCoupon,
  onCouponNavigation,
  onRemoveDiscountCoupon,
  onRemoveDeliveryCoupon,
}) => {
  const { getColor, theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: { marginTop: 14, marginHorizontal: CATALOGUE_GUTTER },
        headingRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        },
        heading: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '700',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: getColor('subText'),
        },
        viewAll: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '700',
          color: getColor('primary'),
        },
        card: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: getColor('white'),
          borderRadius: 16,
          padding: 12,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: `${CATALOGUE_ACCENT}4D`,
          shadowColor: theme.colors.shadow.color,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: theme.colors.shadow.opacity,
          shadowRadius: 3,
          elevation: 2,
        },
        badge: {
          width: 32,
          height: 32,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${CATALOGUE_ACCENT}26`,
        },
        cardText: { flex: 1, minWidth: 0 },
        codeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
        code: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '700',
          letterSpacing: 0.6,
          color: getColor('text'),
        },
        benefit: {
          fontSize: 10,
          lineHeight: 13,
          fontWeight: '800',
          textTransform: 'uppercase',
          color: CATALOGUE_ACCENT,
          backgroundColor: `${CATALOGUE_ACCENT}26`,
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 4,
          overflow: 'hidden',
        },
        appliedNote: { fontSize: 11, lineHeight: 14, color: CATALOGUE_ACCENT },
        action: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '800',
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          color: getColor('primary'),
          paddingHorizontal: 4,
          paddingVertical: 4,
        },
        // Muted, so an unapplied offer never competes with an applied one.
        offerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          backgroundColor: getColor('overlay'),
          borderRadius: 16,
          padding: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: getColor('border'),
        },
        offerText: { flex: 1, minWidth: 0 },
        offerTitle: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '700',
          color: getColor('text'),
        },
        offerSub: { fontSize: 11, lineHeight: 14, color: getColor('subText') },
      }),
    [getColor, theme]
  );

  const applied = [
    selectedDiscountCoupon
      ? { coupon: selectedDiscountCoupon, onRemove: onRemoveDiscountCoupon }
      : null,
    selectedDeliveryCoupon
      ? { coupon: selectedDeliveryCoupon, onRemove: onRemoveDeliveryCoupon }
      : null,
  ].filter(Boolean) as { coupon: AvailableCoupon; onRemove: () => void }[];

  const offerCount = availableCoupons.length;

  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <ThemeText style={styles.heading}>Coupons &amp; Offers</ThemeText>
        {offerCount > 0 ? (
          <TouchableOpacity onPress={onCouponNavigation} accessibilityRole="button">
            <ThemeText style={styles.viewAll}>View All</ThemeText>
          </TouchableOpacity>
        ) : null}
      </View>

      {applied.map(({ coupon, onRemove }) => (
        <View key={coupon.id} style={styles.card}>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="check-decagram" size={18} color={CATALOGUE_ACCENT} />
          </View>
          <View style={styles.cardText}>
            <View style={styles.codeRow}>
              <ThemeText style={styles.code} numberOfLines={1}>
                {coupon.code}
              </ThemeText>
              <ThemeText style={styles.benefit}>{getBenefitLabel(coupon)}</ThemeText>
            </View>
            <ThemeText style={styles.appliedNote}>Coupon applied successfully!</ThemeText>
          </View>
          <TouchableOpacity onPress={onRemove} accessibilityRole="button">
            <ThemeText style={styles.action}>Remove</ThemeText>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.offerRow}
        onPress={onCouponNavigation}
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="tag-outline" size={18} color={getColor('primary')} />
        <View style={styles.offerText}>
          <ThemeText style={styles.offerTitle}>
            {couponLoading
              ? 'Checking offers…'
              : offerCount > 0
                ? applied.length > 0
                  ? 'Try another coupon'
                  : 'Apply a coupon'
                : 'No coupons available'}
          </ThemeText>
          {!couponLoading && offerCount > 0 ? (
            <ThemeText style={styles.offerSub}>
              {offerCount} offer{offerCount === 1 ? '' : 's'} available
            </ThemeText>
          ) : null}
        </View>
        {offerCount > 0 ? (
          <ThemeText style={styles.action}>{applied.length > 0 ? 'Change' : 'Apply'}</ThemeText>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export default CouponSection;
