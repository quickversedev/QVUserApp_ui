import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATALOGUE_ACCENT, CATALOGUE_GUTTER } from '../../../constants/catalogue';
import { getAvailablePaymentOptions, getCODCharges } from '../../../services/paymentService';
import { useTheme } from '../../../theme/ThemeContext';
import { ThemeText } from '../../common/theme/ThemeText';

/**
 * Payment method picker, as a bottom sheet over the cart.
 *
 * This is the step "Proceed to Pay" opens, and the order is placed from it, so the
 * bill it is charging against stays visible behind rather than being replaced by a
 * full screen.
 *
 * Only methods that can actually be chosen are listed. `getAvailablePaymentOptions`
 * also returns PhonePe and Google Pay with `available: false`, and the screen this
 * replaced rendered them as greyed rows above a UPI field that was `editable={false}`
 * at half opacity — three controls that looked like choices and were not.
 */

export type PaymentOptionKey = 'COD' | 'PREPAID';

interface PaymentSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedOption: PaymentOptionKey, upiId?: string) => void;
  paymentMethods?: Parameters<typeof getAvailablePaymentOptions>[0];
  error?: string | null;
  loading?: boolean;
  onRetry?: () => void;
  selectedOption?: PaymentOptionKey;
  /** Amount being charged, echoed on the confirm button. */
  total?: number;
}

const PaymentSheet: React.FC<PaymentSheetProps> = ({
  visible,
  onClose,
  onConfirm,
  paymentMethods = [],
  error = null,
  loading = false,
  onRetry,
  selectedOption,
  total = 0,
}) => {
  const { getColor, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<PaymentOptionKey>(selectedOption || 'PREPAID');

  // Reopening should show what the cart currently holds, not the last local pick.
  useEffect(() => {
    if (visible) setSelected(selectedOption || 'PREPAID');
  }, [visible, selectedOption]);

  const codCharges = useMemo(() => getCODCharges(paymentMethods), [paymentMethods]);

  /**
   * Prepaid is always offered; everything else has to come back available from the
   * server. COD carries its charge in the subtitle when there is one — it changes the
   * total, so it belongs next to the choice rather than only in the bill.
   */
  const options = useMemo(() => {
    const serverOptions = getAvailablePaymentOptions(paymentMethods)
      .filter(o => o.available && o.key === 'COD')
      .map(o => ({
        key: 'COD' as PaymentOptionKey,
        title: o.title,
        subtitle: codCharges > 0 ? `${o.subtitle} · ₹${codCharges} extra` : o.subtitle,
      }));
    return [
      { key: 'PREPAID' as PaymentOptionKey, title: 'Prepaid', subtitle: 'Pay securely using UPI' },
      ...serverOptions,
    ];
  }, [paymentMethods, codCharges]);

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
        option: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: getColor('white'),
          borderRadius: 16,
          padding: 14,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: getColor('border'),
          shadowColor: theme.colors.shadow.color,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: theme.colors.shadow.opacity,
          shadowRadius: 3,
          elevation: 2,
        },
        optionSelected: { borderWidth: 1.5, borderColor: CATALOGUE_ACCENT },
        radioOuter: {
          width: 20,
          height: 20,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: getColor('border'),
          alignItems: 'center',
          justifyContent: 'center',
        },
        radioOuterSelected: { borderColor: CATALOGUE_ACCENT },
        radioInner: { width: 10, height: 10, borderRadius: 999, backgroundColor: CATALOGUE_ACCENT },
        optionText: { flex: 1, minWidth: 0 },
        optionTitle: { fontSize: 14, lineHeight: 18, fontWeight: '700', color: getColor('text') },
        optionSubtitle: {
          fontSize: 11,
          lineHeight: 15,
          color: getColor('subText'),
          marginTop: 1,
        },
        notice: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderRadius: 12,
          padding: 12,
          backgroundColor: `${getColor('error')}14`,
        },
        noticeText: { flex: 1, fontSize: 12, lineHeight: 16, color: getColor('error') },
        retry: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '800',
          textTransform: 'uppercase',
          color: getColor('primary'),
        },
        loadingText: { padding: 16, textAlign: 'center', color: getColor('subText') },
        confirm: {
          marginHorizontal: CATALOGUE_GUTTER,
          marginTop: 10,
          height: 50,
          borderRadius: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: CATALOGUE_ACCENT,
        },
        confirmDisabled: { backgroundColor: getColor('border') },
        confirmLabel: {
          fontSize: 15,
          lineHeight: 20,
          fontWeight: '800',
          color: getColor('white'),
        },
      }),
    [getColor, theme, insets.bottom]
  );

  const blocked = Boolean(error) || loading;

  /**
   * The total is only quotable while the picked method still matches the one the
   * summary was computed for. Switch to COD and the server has not yet added its
   * charge, so naming a figure here would understate what is about to be taken —
   * this vendor happens to charge nothing for COD, which hides the error rather
   * than removing it.
   */
  const canQuoteTotal = total > 0 && selected === (selectedOption || 'PREPAID');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Stops a tap inside the sheet from closing it via the backdrop. */}
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.grabber} />
          <View style={styles.headRow}>
            <ThemeText style={styles.title}>Payment Options</ThemeText>
            <TouchableOpacity onPress={onClose} accessibilityRole="button">
              <MaterialCommunityIcons name="close" size={22} color={getColor('text')} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.list}>
            {error ? (
              <View style={styles.notice}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={18}
                  color={getColor('error')}
                />
                <ThemeText style={styles.noticeText}>{error}</ThemeText>
                {onRetry ? (
                  <TouchableOpacity onPress={onRetry} disabled={loading}>
                    <ThemeText style={styles.retry}>{loading ? 'Retrying…' : 'Retry'}</ThemeText>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}

            {loading ? (
              <ThemeText style={styles.loadingText}>Loading payment methods…</ThemeText>
            ) : null}

            {options.map(option => {
              const isSelected = selected === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => setSelected(option.key)}
                  activeOpacity={0.85}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={option.title}
                >
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected ? <View style={styles.radioInner} /> : null}
                  </View>
                  <View style={styles.optionText}>
                    <ThemeText style={styles.optionTitle}>{option.title}</ThemeText>
                    {option.subtitle ? (
                      <ThemeText style={styles.optionSubtitle}>{option.subtitle}</ThemeText>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={[styles.confirm, blocked && styles.confirmDisabled]}
            onPress={() => onConfirm(selected)}
            disabled={blocked}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            <ThemeText style={styles.confirmLabel}>
              {canQuoteTotal ? `Pay ₹${total.toFixed(2)}` : 'Confirm and continue'}
            </ThemeText>
            <MaterialCommunityIcons name="arrow-right" size={18} color={getColor('white')} />
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default PaymentSheet;
