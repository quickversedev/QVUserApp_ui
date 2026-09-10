import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { CATALOGUE_ACCENT, CATALOGUE_GUTTER } from '../../../constants/catalogue';
import { RootStackParamList } from '../../../routes/AppStack';
import { CartProduct } from '../../../store/cart/cartStore';
import { useTheme } from '../../../theme/ThemeContext';
import { Vendor } from '../../../types/vendor';
import { ThemeText } from '../../common/theme/ThemeText';
import CartItem from './CartItem';

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cart'>;

interface CartItemListProps {
  items: CartProduct[];
  onInc: (sku: string) => void;
  onDec: (sku: string) => void;
  vendor?: Vendor;
  /** "1.2 km away", computed by the screen from vendor and customer coordinates. */
  distanceText?: string | null;
  navigation: CartScreenNavigationProp;
}

/**
 * The cart's items, in the QV Cart design: a section heading, a store header, then one
 * raised card per line.
 *
 * The single bordered panel that used to wrap all of this is gone — in the design each
 * row is its own surface sitting on the page, so the outer box was a box around boxes.
 *
 * The design's store header belongs to its multi-store sourcing banner, which does not
 * apply: a QuickVerse cart is keyed `vendor_<shopId>` and always holds exactly one
 * vendor. What survives is the part that is true for one store — who it is, how far,
 * and how long it takes.
 */
const CartItemList: React.FC<CartItemListProps> = ({
  items,
  onInc,
  onDec,
  vendor,
  distanceText,
  navigation,
}) => {
  const { getColor, theme } = useTheme();

  // The API sends this as free text, not minutes, so it is rendered as given.
  const preparationTime = useMemo(() => vendor?.preparationTime || '30 mins', [vendor]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: {
          marginHorizontal: CATALOGUE_GUTTER,
          marginTop: 14,
        },
        sectionHeading: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '700',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: getColor('subText'),
          marginBottom: 8,
        },
        storeCard: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: getColor('white'),
          borderRadius: 16,
          padding: 12,
          marginBottom: 10,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: getColor('border'),
          shadowColor: theme.colors.shadow.color,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: theme.colors.shadow.opacity,
          shadowRadius: 3,
          elevation: 2,
        },
        storeIcon: {
          width: 32,
          height: 32,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${getColor('primary')}1F`,
        },
        storeText: { flex: 1, minWidth: 0 },
        storeName: {
          fontSize: 13,
          lineHeight: 17,
          fontWeight: '700',
          color: getColor('text'),
        },
        storeMeta: {
          fontSize: 11,
          lineHeight: 14,
          color: getColor('subText'),
        },
        // The design's filled-green time pill, bolt and all.
        etaPill: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 999,
          backgroundColor: CATALOGUE_ACCENT,
        },
        etaLabel: {
          fontSize: 10,
          lineHeight: 12,
          fontWeight: '800',
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          color: getColor('white'),
        },
        items: { gap: 10 },
        addMoreButton: {
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          borderRadius: 12,
          paddingVertical: 12,
          borderWidth: 1.5,
          borderColor: getColor('primary'),
          borderStyle: 'dashed',
        },
        addMoreText: {
          fontSize: 13,
          lineHeight: 17,
          fontWeight: '700',
          color: getColor('primary'),
        },
      }),
    [getColor, theme]
  );

  const handleAddMore = useCallback(() => {
    if (vendor) {
      navigation.navigate('VendorProduct', { vendor });
    }
  }, [vendor, navigation]);

  const renderCartItem = useCallback(
    (item: CartProduct) => (
      <CartItem
        key={item.sku}
        {...item}
        onInc={() => onInc(item.sku)}
        onDec={() => onDec(item.sku)}
      />
    ),
    [onInc, onDec]
  );

  return (
    <View style={styles.section}>
      <ThemeText style={styles.sectionHeading}>Cart Items</ThemeText>

      {vendor ? (
        <View style={styles.storeCard}>
          <View style={styles.storeIcon}>
            <MaterialCommunityIcons name="storefront" size={18} color={getColor('primary')} />
          </View>
          <View style={styles.storeText}>
            <ThemeText style={styles.storeName} numberOfLines={1}>
              {vendor.name}
            </ThemeText>
            {distanceText ? (
              <ThemeText style={styles.storeMeta} numberOfLines={1}>
                {distanceText}
              </ThemeText>
            ) : null}
          </View>
          <View style={styles.etaPill}>
            <MaterialCommunityIcons name="flash" size={12} color={getColor('white')} />
            <ThemeText style={styles.etaLabel}>{preparationTime}</ThemeText>
          </View>
        </View>
      ) : null}

      <View style={styles.items}>{items.map(renderCartItem)}</View>

      <TouchableOpacity style={styles.addMoreButton} onPress={handleAddMore} activeOpacity={0.7}>
        <MaterialCommunityIcons name="plus" size={16} color={getColor('primary')} />
        <ThemeText style={styles.addMoreText}>Add More Items</ThemeText>
      </TouchableOpacity>
    </View>
  );
};

export default CartItemList;
