import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import React, { useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATALOGUE_ACCENT, CATALOGUE_GUTTER } from '../../../constants/catalogue';
import { useTheme } from '../../../theme/ThemeContext';
import { ThemeText } from '../../common/theme/ThemeText';

/**
 * Coupon picker, as a bottom sheet.
 *
 * This replaces a push to CouponsScreen. Choosing a coupon does not leave the cart —
 * applying one changes the bill you were just reading, so sending the customer to a
 * separate screen and back lost the thing they were deciding against.
 *
 * Applying is local: the id is held on the cart and the discount is computed
 * server-side on the next checkout-summary call. Nothing here is authoritative about
 * the amount, which is why a coupon below its minimum order is shown with the gap to
 * close rather than a figure it would have to invent.
 */

export interface SheetCoupon {
  id: string;
  code: string;
  mov: number;
  discountValue: number | null;
  type: string;
  uptoValue: number | null;
}

interface CouponSheetProps {
  visible: boolean;
  onClose: () => void;
  coupons: SheetCoupon[];
  loading?: boolean;
  /** Cart subtotal, to test each coupon's minimum order against. */
  cartTotal: number;
  selectedDiscountCoupon: SheetCoupon | null;
  selectedDeliveryCoupon: SheetCoupon | null;
  onApplyDiscount: (coupon: SheetCoupon | null) => void;
  onApplyDelivery: (coupon: SheetCoupon | null) => void;
}

export const couponBenefit = (coupon: SheetCoupon): string => {
  if (coupon.type === 'FREE_DELIVERY') return 'Free delivery';
  if (coupon.type === 'FIXED' && coupon.discountValue != null) {
    return `₹${coupon.discountValue} OFF`;
  }
  if (coupon.type === 'PERCENTAGE' && coupon.discountValue != null) {
    return coupon.uptoValue
      ? `${coupon.discountValue}% OFF up to ₹${coupon.uptoValue}`
      : `${coupon.discountValue}% OFF`;
  }
  return 'Offer';
};

export const couponTerms = (coupon: SheetCoupon): string =>
  coupon.mov > 0 ? `${couponBenefit(coupon)} above ₹${coupon.mov}` : couponBenefit(coupon);

const CouponSheet: React.FC<CouponSheetProps> = ({
  visible,
  onClose,
  coupons,
  loading = false,
  cartTotal,
  selectedDiscountCoupon,
  selectedDeliveryCoupon,
  onApplyDiscount,
  onApplyDelivery,
}) => {
  const { getColor, theme } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
        sheet: {
          backgroundColor: getColor('background'),
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: Math.max(insets.bottom, 12) + 8,
          maxHeight: '80%',
        },
        grabber: {
          alignSelf: 'center',
          width: 40,
          height: 4,
          borderRadius: 999,
          backgroundColor: getColor('border'),
          marginTop: 10,
          marginBottom: 6,
        },
        headRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: CATALOGUE_GUTTER,
          paddingVertical: 10,
        },
        title: { fontSize: 16, lineHeight: 20, fontWeight: '800', color: getColor('text') },
        list: { paddingHorizontal: CATALOGUE_GUTTER, paddingBottom: 8, gap: 8 },
        groupLabel: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '700',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: getColor('subText'),
          marginTop: 8,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: getColor('white'),
          borderRadius: 16,
          padding: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: getColor('border'),
          shadowColor: theme.colors.shadow.color,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: theme.colors.shadow.opacity,
          shadowRadius: 3,
          elevation: 2,
        },
        rowApplied: { borderWidth: 1, borderColor: `${CATALOGUE_ACCENT}4D` },
        rowLocked: { opacity: 0.7 },
        icon: {
          width: 32,
          height: 32,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${getColor('primary')}1F`,
        },
        text: { flex: 1, minWidth: 0 },
        code: { fontSize: 13, lineHeight: 17, fontWeight: '800', color: getColor('text') },
        terms: { fontSize: 11, lineHeight: 15, color: getColor('subText'), marginTop: 1 },
        // The gap to close, never a discount figure this screen cannot compute.
        locked: { fontSize: 11, lineHeight: 15, color: getColor('error'), marginTop: 2 },
        action: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '800',
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          color: getColor('primary'),
          paddingHorizontal: 6,
          paddingVertical: 6,
        },
        actionApplied: { color: CATALOGUE_ACCENT },
        // A locked coupon's button is disabled; leaving it in the action colour made
        // it look tappable and it silently did nothing.
        actionLocked: { color: getColor('placeholder') },
        empty: { padding: 24, alignItems: 'center' },
      }),
    [getColor, theme, insets.bottom]
  );

  const discountCoupons = coupons.filter(c => c.type !== 'FREE_DELIVERY');
  const deliveryCoupons = coupons.filter(c => c.type === 'FREE_DELIVERY');

  const renderRow = (coupon: SheetCoupon, isDelivery: boolean) => {
    const selected = isDelivery ? selectedDeliveryCoupon : selectedDiscountCoupon;
    const isApplied = selected?.id === coupon.id;
    const shortfall = coupon.mov > 0 ? coupon.mov - cartTotal : 0;
    const locked = shortfall > 0 && !isApplied;
    const apply = isDelivery ? onApplyDelivery : onApplyDiscount;

    return (
      <View
        key={coupon.id}
        style={[styles.row, isApplied && styles.rowApplied, locked && styles.rowLocked]}
      >
        <View style={styles.icon}>
          <MaterialCommunityIcons
            name={isDelivery ? 'truck-fast-outline' : 'tag-outline'}
            size={18}
            color={isApplied ? CATALOGUE_ACCENT : getColor('primary')}
          />
        </View>
        <View style={styles.text}>
          <ThemeText style={styles.code} numberOfLines={1}>
            {coupon.code}
          </ThemeText>
          <ThemeText style={styles.terms} numberOfLines={2}>
            {couponTerms(coupon)}
          </ThemeText>
          {locked ? (
            <ThemeText style={styles.locked}>Add ₹{Math.ceil(shortfall)} more to unlock</ThemeText>
          ) : null}
        </View>
        <TouchableOpacity
          disabled={locked}
          onPress={() => {
            apply(isApplied ? null : coupon);
            if (!isApplied) onClose();
          }}
          accessibilityRole="button"
          accessibilityLabel={`${isApplied ? 'Remove' : 'Apply'} coupon ${coupon.code}`}
        >
          <ThemeText
            style={[
              styles.action,
              isApplied && styles.actionApplied,
              locked && styles.actionLocked,
            ]}
          >
            {isApplied ? 'Remove' : 'Apply'}
          </ThemeText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Stops a tap inside the sheet from closing it via the backdrop. */}
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.grabber} />
          <View style={styles.headRow}>
            <ThemeText style={styles.title}>Coupons &amp; Offers</ThemeText>
            <TouchableOpacity onPress={onClose} accessibilityRole="button">
              <MaterialCommunityIcons name="close" size={22} color={getColor('text')} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.list}>
            {loading ? (
              <View style={styles.empty}>
                <ThemeText color={getColor('subText')}>Checking offers…</ThemeText>
              </View>
            ) : coupons.length === 0 ? (
              <View style={styles.empty}>
                <ThemeText color={getColor('subText')}>No coupons available right now</ThemeText>
              </View>
            ) : (
              <>
                {discountCoupons.length > 0 ? (
                  <>
                    <ThemeText style={styles.groupLabel}>Discount offers</ThemeText>
                    {discountCoupons.map(c => renderRow(c, false))}
                  </>
                ) : null}
                {deliveryCoupons.length > 0 ? (
                  <>
                    <ThemeText style={styles.groupLabel}>Free delivery</ThemeText>
                    {deliveryCoupons.map(c => renderRow(c, true))}
                  </>
                ) : null}
              </>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CouponSheet;
