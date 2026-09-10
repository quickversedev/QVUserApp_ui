import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { CATALOGUE_ACCENT, CATALOGUE_GUTTER } from '../../../constants/catalogue';
import { useTheme } from '../../../theme/ThemeContext';
import { ThemeText } from '../../common/theme/ThemeText';
import { TIP_IS_CHARGEABLE, tipContribution } from './TipSelector';

interface Coupon {
  id: string;
  code: string;
  mov: number;
  discountValue: number | null;
  type: string;
  uptoValue: number | null;
}

interface CheckoutSummary {
  itemTotalAmount?: number;
  couponId?: string | null;
  couponCode?: string | null;
  couponDiscount?: number;
  isFreeDelivery?: boolean;
  amountAfterCoupon?: number;
  packagingCharges?: number;
  actualDeliveryFee?: number;
  deliveryFee?: number;
  platformFee?: number;
  serviceGstRate?: number;
  commissionRate?: number;
  commission?: number;
  commissionGst?: number;
  deliveryGst?: number;
  packagingGst?: number;
  platformGst?: number;
  totalGst?: number;
  taxableAmount?: number;
  payableAmount?: number;
  razorpayCharges?: number;
  couponError?: string | null;
  couponErrorMessage?: string | null;
  couponApplied?: boolean;
  deliveryCouponId?: string | null;
  deliveryCouponCode?: string | null;
  isDeliveryCouponApplied?: boolean;
  deliveryCouponError?: string | null;
  deliveryCouponErrorMessage?: string | null;
  codCharges?: number;
  codGst?: number;
}

interface PaymentSummaryProps {
  expanded: boolean;
  onToggle: () => void;
  summary?: CheckoutSummary | null;
  summaryLoading?: boolean;
  selectedPaymentOption?: string | undefined;
  selectedCoupon?: Coupon;
  selectedDeliveryCoupon?: Coupon;
  platformFeeOriginal?: number;
  packagingChargesOriginal?: number;
  /**
   * Selected tip. Shown as a bill row, but it only reaches the total while
   * TIP_IS_CHARGEABLE is true — the backend cannot carry a tip yet, so by default the
   * total here stays equal to what is actually charged. See TipSelector.
   */
  tipAmount?: number;
  /** Total saved on this order; drives the design's savings line and banner. */
  savings?: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  expanded,
  onToggle,
  summary,
  summaryLoading = false,
  selectedPaymentOption,
  selectedCoupon,
  platformFeeOriginal,
  packagingChargesOriginal,
  tipAmount = 0,
  savings = 0,
}) => {
  const { getColor, theme } = useTheme();
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const animatedRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: expanded ? 1 : 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: expanded ? 1 : 0,
        duration: 250,
        delay: expanded ? 100 : 0,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animatedRotation, {
        toValue: expanded ? 1 : 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [expanded, animatedHeight, animatedOpacity, animatedRotation]);

  const rotateInterpolate = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const itemTotalAmount = summary?.itemTotalAmount ?? 0;
  const couponDiscount = summary?.couponDiscount ?? 0;
  const isFreeDelivery = summary?.isFreeDelivery ?? false;
  const packagingCharges = summary?.packagingCharges ?? 0;
  const actualDeliveryFee = summary?.actualDeliveryFee ?? 0;
  const deliveryFee = summary?.deliveryFee ?? 0;
  const platformFee = summary?.platformFee ?? 0;
  const serviceGstRate = summary?.serviceGstRate ?? 0;
  const commissionRate = summary?.commissionRate ?? 0;
  const commission = summary?.commission ?? 0;
  const commissionGst = summary?.commissionGst ?? 0;
  const deliveryGst = summary?.deliveryGst ?? 0;
  const packagingGst = summary?.packagingGst ?? 0;
  const platformGst = summary?.platformGst ?? 0;
  const totalGst = summary?.totalGst ?? 0;
  const taxableAmount = summary?.taxableAmount ?? 0;
  const payableAmount = summary?.payableAmount ?? 0;
  const razorpayCharges = summary?.razorpayCharges ?? 0;
  const codCharges = summary?.codCharges ?? 0;
  const codGst = summary?.codGst ?? 0;
  const isCod = selectedPaymentOption === 'COD';
  // const extraPaymentCharges = isCod ? codCharges : razorpayCharges;
  const tipOnBill = tipContribution(tipAmount);
  const finalTotal = payableAmount + tipOnBill;

  const styles = StyleSheet.create({
    paymentSummaryBox: {
      backgroundColor: getColor('white'),
      borderRadius: 16,
      marginHorizontal: CATALOGUE_GUTTER,
      marginTop: 14,
      marginBottom: 0,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: getColor('border'),
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow.color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    billDetailsTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    titleLine: {
      flex: 1,
      height: 1,
      backgroundColor: getColor('border'),
    },
    titleText: {
      color: getColor('text'),
      marginHorizontal: 12,
      textTransform: 'uppercase',
      fontWeight: '600',
    },
    // The design lays the rows straight on the card; the inset grey panel was a box
    // inside a box.
    billBreakdown: {
      paddingTop: 4,
    },
    grandTotalLabel: { fontSize: 14, lineHeight: 18, fontWeight: '800', color: getColor('text') },
    savedLine: {
      fontSize: 10,
      lineHeight: 13,
      fontWeight: '800',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      color: CATALOGUE_ACCENT,
      marginTop: 2,
    },
    grandTotalAmount: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '800',
      color: getColor('text'),
    },
    savingsBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 10,
      padding: 10,
      borderRadius: 12,
      backgroundColor: `${CATALOGUE_ACCENT}14`,
    },
    savingsBannerText: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '700',
      color: CATALOGUE_ACCENT,
    },
    billRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    billRowLast: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 0,
    },
    billLabel: {
      color: getColor('text'),
    },
    tipNote: {
      fontSize: 11,
      lineHeight: 14,
      color: getColor('subText'),
      marginTop: -2,
      marginBottom: 2,
    },
    billAmount: {
      color: getColor('text'),
      fontWeight: '500',
    },
    discountAmount: {
      color: getColor('primary'),
      fontWeight: '600',
    },
    dottedLine: {
      borderStyle: 'dashed',
      borderWidth: 1,
      borderColor: getColor('border'),
      marginVertical: 10,
    },
    paymentSummaryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 40,
    },
    iconBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    paymentSummaryContent: {
      flex: 1,
    },
    paymentSummaryTitle: {
      color: getColor('text'),
      fontWeight: '700',
    },
    paymentSummaryAmount: {
      // Near-black, not amber: the design prices in its darkest text colour and
      // spends colour only on savings, the same rule the PDP follows.
      color: getColor('text'),
      marginTop: 2,
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '800',
    },
    paymentSummaryDetails: { marginTop: 12 },
    crossedText: {
      textDecorationLine: 'line-through',
      opacity: 0.5,
      marginRight: 6,
      fontSize: 13,
    },
    feeRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.paymentSummaryBox}>
      <TouchableOpacity style={styles.paymentSummaryHeader} onPress={onToggle} activeOpacity={0.7}>
        <View style={[styles.iconBadge, { backgroundColor: `${getColor('primary')}12` }]}>
          <MaterialCommunityIcons
            name="file-document-outline"
            size={22}
            color={getColor('primary')}
          />
        </View>
        <View style={styles.paymentSummaryContent}>
          <ThemeText variant="body" style={styles.paymentSummaryTitle}>
            Bill Details
          </ThemeText>
          {summaryLoading && !summary ? (
            <ActivityIndicator
              size="small"
              color={getColor('primary')}
              style={{ alignSelf: 'flex-start', marginTop: 4 }}
            />
          ) : !expanded ? (
            /* Collapsed, the header is the only place the total appears. Expanded, it
               would repeat the Grand Total row a few lines below. */
            <ThemeText variant="body" style={styles.paymentSummaryAmount}>
              ₹{finalTotal.toFixed(2)}
            </ThemeText>
          ) : null}
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <MaterialCommunityIcons name="chevron-down" size={24} color={getColor('text')} />
        </Animated.View>
      </TouchableOpacity>

      {/* Height is left to the content instead of being animated through maxHeight.
          That interpolation capped the reveal at a hardcoded 600px, and because the
          measuring child sat inside the clip it could only ever measure the clipped
          height — so the bill silently lost its last rows, Grand Total included, as
          soon as it grew past the cap. Fading a conditionally-rendered block cannot
          truncate anything. */}
      {expanded ? (
        <Animated.View style={[styles.paymentSummaryDetails, { opacity: animatedOpacity }]}>
          <View style={styles.billBreakdown}>
            {summaryLoading && !summary ? (
              <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={getColor('primary')} />
              </View>
            ) : (
              <>
                <View style={styles.billRow}>
                  <ThemeText variant="body" style={styles.billLabel}>
                    Sub Total
                  </ThemeText>
                  <ThemeText variant="body" style={styles.billAmount}>
                    ₹{itemTotalAmount.toFixed(2)}
                  </ThemeText>
                </View>

                {couponDiscount > 0 && (
                  <View style={styles.billRow}>
                    <ThemeText variant="body" style={styles.billLabel}>
                      Coupon Discount
                    </ThemeText>
                    <ThemeText variant="body" style={styles.discountAmount}>
                      -₹{couponDiscount.toFixed(2)}
                    </ThemeText>
                  </View>
                )}

                <View style={styles.dottedLine} />

                <View style={styles.billRow}>
                  <ThemeText variant="body" style={styles.billLabel}>
                    Delivery Fee
                  </ThemeText>
                  <View style={styles.feeRow}>
                    {isFreeDelivery ? (
                      <>
                        <ThemeText
                          variant="body"
                          style={[styles.crossedText, { color: getColor('text') }]}
                        >
                          ₹{actualDeliveryFee.toFixed(2)}
                        </ThemeText>
                        <ThemeText
                          variant="body"
                          style={[styles.discountAmount, { color: getColor('primary') }]}
                        >
                          FREE
                        </ThemeText>
                      </>
                    ) : (
                      <>
                        {actualDeliveryFee > deliveryFee && (
                          <ThemeText
                            variant="body"
                            style={[styles.crossedText, { color: getColor('text') }]}
                          >
                            ₹{actualDeliveryFee.toFixed(2)}
                          </ThemeText>
                        )}
                        <ThemeText variant="body" style={styles.billAmount}>
                          ₹{deliveryFee.toFixed(2)}
                        </ThemeText>
                      </>
                    )}
                  </View>
                </View>

                <View style={styles.billRow}>
                  <ThemeText variant="body" style={styles.billLabel}>
                    Platform Fee
                  </ThemeText>
                  <View style={styles.feeRow}>
                    {platformFeeOriginal != null && platformFeeOriginal > platformFee && (
                      <ThemeText
                        variant="body"
                        style={[styles.crossedText, { color: getColor('text') }]}
                      >
                        ₹{platformFeeOriginal.toFixed(2)}
                      </ThemeText>
                    )}
                    <ThemeText variant="body" style={styles.billAmount}>
                      ₹{platformFee.toFixed(2)}
                    </ThemeText>
                  </View>
                </View>

                {tipAmount > 0 && (
                  <View style={styles.billRow}>
                    <ThemeText variant="body" style={styles.billLabel}>
                      Delivery Partner Tip
                    </ThemeText>
                    <ThemeText variant="body" style={styles.billAmount}>
                      ₹{tipAmount.toFixed(2)}
                      {TIP_IS_CHARGEABLE ? '' : ' *'}
                    </ThemeText>
                  </View>
                )}

                {/* The tip cannot be charged yet, so it is excluded from the total the
                  customer is asked to pay. Saying so beats a total that disagrees with
                  the amount taken. Remove with TIP_IS_CHARGEABLE — see QV-17. */}
                {tipAmount > 0 && !TIP_IS_CHARGEABLE && (
                  <ThemeText variant="caption" style={styles.tipNote}>
                    * Tip is not charged with this order yet
                  </ThemeText>
                )}

                {packagingCharges > 0 && (
                  <View style={styles.billRow}>
                    <ThemeText variant="body" style={styles.billLabel}>
                      Packaging Charges
                    </ThemeText>
                    <View style={styles.feeRow}>
                      {packagingChargesOriginal != null &&
                        packagingChargesOriginal > packagingCharges && (
                          <ThemeText
                            variant="body"
                            style={[styles.crossedText, { color: getColor('text') }]}
                          >
                            ₹{packagingChargesOriginal.toFixed(2)}
                          </ThemeText>
                        )}
                      <ThemeText variant="body" style={styles.billAmount}>
                        ₹{packagingCharges.toFixed(2)}
                      </ThemeText>
                    </View>
                  </View>
                )}

                {isCod && codCharges > 0 && (
                  <View style={styles.billRow}>
                    <ThemeText variant="body" style={styles.billLabel}>
                      Cash On Delivery Charges
                    </ThemeText>
                    <ThemeText variant="body" style={styles.billAmount}>
                      ₹{codCharges.toFixed(2)}
                    </ThemeText>
                  </View>
                )}

                {totalGst > 0 && (
                  <View>
                    <Pressable
                      style={styles.billRow}
                      onPress={() => setShowTaxBreakdown(prev => !prev)}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ThemeText variant="body" style={styles.billLabel}>
                          Taxes (GST & Services)
                        </ThemeText>
                        <MaterialCommunityIcons
                          name={showTaxBreakdown ? 'chevron-up' : 'information-outline'}
                          size={14}
                          color={getColor('subText')}
                          style={{ marginLeft: 4 }}
                        />
                      </View>
                      <ThemeText variant="body" style={styles.billAmount}>
                        ₹{totalGst.toFixed(2)}
                      </ThemeText>
                    </Pressable>

                    {showTaxBreakdown && (
                      <View
                        style={{
                          backgroundColor: getColor('card'),
                          borderWidth: 1,
                          borderColor: getColor('border'),
                          borderRadius: theme.borderRadius.sm,
                          padding: 12,
                          marginBottom: 10,
                          gap: 4,
                        }}
                      >
                        {platformGst > 0 && (
                          <ThemeText variant="caption" color={getColor('subText')}>
                            Platform GST: ₹{platformGst.toFixed(2)}
                          </ThemeText>
                        )}
                        {deliveryGst > 0 && (
                          <ThemeText variant="caption" color={getColor('subText')}>
                            Delivery GST: ₹{deliveryGst.toFixed(2)}
                          </ThemeText>
                        )}
                        {packagingGst > 0 && (
                          <ThemeText variant="caption" color={getColor('subText')}>
                            Packaging GST: ₹{packagingGst.toFixed(2)}
                          </ThemeText>
                        )}
                        {codGst > 0 && (
                          <ThemeText variant="caption" color={getColor('subText')}>
                            COD GST: ₹{codGst.toFixed(2)}
                          </ThemeText>
                        )}
                        <View
                          style={{
                            borderTopWidth: 1,
                            borderTopColor: getColor('border'),
                            marginVertical: 4,
                          }}
                        />
                        <ThemeText
                          variant="caption"
                          color={getColor('text')}
                          style={{ fontWeight: '600' }}
                        >
                          Taxable Pool Base: ₹{taxableAmount.toFixed(2)}
                        </ThemeText>
                        <ThemeText
                          variant="caption"
                          color={getColor('primary')}
                          style={{ fontWeight: '700' }}
                        >
                          GST Total ({serviceGstRate.toFixed(0)}%): ₹{totalGst.toFixed(2)}
                        </ThemeText>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.dottedLine} />

                <View style={styles.billRowLast}>
                  <View>
                    <ThemeText variant="body" style={styles.grandTotalLabel}>
                      Grand Total
                    </ThemeText>
                    {savings > 0 ? (
                      <ThemeText style={styles.savedLine}>
                        Saved ₹{savings.toFixed(2)} on this order
                      </ThemeText>
                    ) : null}
                  </View>
                  <ThemeText variant="body" style={styles.grandTotalAmount}>
                    ₹{finalTotal.toFixed(2)}
                  </ThemeText>
                </View>

                {savings > 0 ? (
                  <View style={styles.savingsBanner}>
                    <MaterialCommunityIcons
                      name="piggy-bank-outline"
                      size={18}
                      color={CATALOGUE_ACCENT}
                    />
                    <ThemeText style={styles.savingsBannerText}>
                      You saved ₹{savings.toFixed(2)}. Great!
                    </ThemeText>
                  </View>
                ) : null}
              </>
            )}
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
};

export default PaymentSummary;
