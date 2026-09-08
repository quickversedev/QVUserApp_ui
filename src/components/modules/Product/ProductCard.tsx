import React, { memo, useMemo } from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Product } from '../../../types/product';
import { BadgeTag } from '../../common';
import RatingBadge from '../../common/badges/RatingBadge';
import AddButton from './AddButton';
import QuantitySelector from './QuantitySelector';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 4;
const SIDEBAR_WIDTH = 85;
const PRODUCT_LIST_PADDING = 8;
const AVAILABLE_WIDTH = SCREEN_WIDTH - SIDEBAR_WIDTH - PRODUCT_LIST_PADDING * 2;
const CARD_WIDTH = ((SCREEN_WIDTH - CARD_MARGIN * 4) / 3) * 0.92;
const CARD_WIDTH_SMALL = CARD_WIDTH * 0.8;
// 'xs' is used only by the "Add a little somethin'" suggestion strips
// (modules/Cart/SuggestedItems and modules/Product/SuggestedItems). Sized to show
// ~3.7 cards so the next one is visibly clipped, hinting that the row scrolls.
const EXTRA_SMALL_CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * 6) / 3.7;
const CARD_WIDTH_BIG = (AVAILABLE_WIDTH - CARD_MARGIN * 3) / 2; // 2 cards per row with sidebar

// The QV PLP design's cart-control accent (its `secondary` / `on-secondary` pair).
// Hardcoded because the theme carries no green — `main` and `secondary` are both
// amber — and the design pairs a green-on-white ADD with a white-on-green stepper.
const PLP_ACCENT = '#006D30';
const PLP_ON_ACCENT = '#FFFFFF';

/**
 * The PLP grid drops a whole rupee value's ".00", as the design does. The row there
 * is only ~130px wide and the cart control claims 80 of it, so the two trailing
 * zeroes are the difference between the price fitting and being clipped. Other sizes
 * keep two decimals.
 */
const formatAmount = (value: number, compact: boolean) =>
  compact && Number.isInteger(value) ? String(value) : value.toFixed(2);

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'xs' | 'small' | 'regular' | 'big';
  disabled?: boolean;
  showVariantsCount?: boolean;
  onPress?: () => void;
  backgroundColor?: string;
  rating?: number;
  isStoreClosed?: boolean;
}

// Helper to get card width based on size
const getCardWidth = (size: 'xs' | 'small' | 'regular' | 'big') => {
  switch (size) {
    case 'xs':
      return EXTRA_SMALL_CARD_WIDTH;
    case 'small':
      return CARD_WIDTH_SMALL;
    case 'big':
      return CARD_WIDTH_BIG;
    default:
      return CARD_WIDTH;
  }
};

// Extract styles outside component to prevent recreation on every render
const createStyles = (
  size: 'xs' | 'small' | 'regular' | 'big',
  getColor: (color: any) => string,
  getTypography: (type: 'small' | 'caption' | 'h1' | 'h2' | 'subtitle' | 'body') => number,
  theme: { borderRadius: { sm: number } },
  veg: boolean,
  backgroundColor?: string
) =>
  StyleSheet.create({
    card: {
      backgroundColor: backgroundColor || getColor('background'),
      borderRadius: theme.borderRadius.sm,
      margin: CARD_MARGIN,
      width: getCardWidth(size),
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    imageContainer: {
      width: '100%',
      // 'xs' is square rather than the default 7/5 landscape — the suggestion
      // strip's photos were the smallest thing on the card, so height was the
      // cheapest way to give the food more presence.
      // 'big' is 4/3 rather than the design's square: at a 138px card a square photo
      // is ~139px tall, which pushes the card to ~209px and leaves the third grid row's
      // price below the fold. 4/3 takes ~35px off without cropping much.
      aspectRatio: size === 'xs' ? 1 : size === 'small' ? 4.8 / 5 : size === 'big' ? 4 / 3 : 7 / 5,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
      marginBottom: size === 'xs' ? 4 : size === 'big' ? 4 : 8,
      position: 'relative',
      alignSelf: 'stretch',
      backgroundColor: getColor('border'),
      // Ensure proper image container sizing
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: theme.borderRadius.sm,
      // Ensure image fits properly within container
      flex: 1,
      alignSelf: 'stretch',
    },
    ratingBadge: {
      position: 'absolute',
      top: size === 'xs' ? 4 : 8,
      right: size === 'xs' ? 4 : 8,
      zIndex: 2,
    },
    badgeTag: {
      position: 'absolute',
      top: 0,
      left: -1,
      zIndex: 2,
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      marginHorizontal: size === 'xs' ? 2 : 4,
      marginBottom: size === 'xs' ? 2 : size === 'big' ? 1 : 4,
    },
    // Undoes AddButton/QuantitySelector's absolute bottom-right placement so the
    // control sits inline at the end of the price row. Geometry follows the QV PLP
    // spec (32px tall, 12px horizontal padding, 8px radius).
    inlineCartControl: {
      position: 'relative',
      right: 0,
      bottom: 0,
      // 30 is the floor: it matches the 'small' stepper's own ± hit-target height,
      // so the glyphs are not clipped. Both controls share this height and width so
      // the card doesn't resize on the first add.
      height: 30,
      // A fixed width, not a minimum, so ADD and the stepper occupy exactly the same
      // box and the price beside them never shifts when the cart state changes. 80 is
      // the floor: the 'small' stepper's own hit targets (28 + 28 + 16 + 8 of margin)
      // come to exactly that, and the card only affords ~130px for row and price both.
      width: 80,
      minWidth: 0,
      borderRadius: 8,
    },
    /**
     * Grid only, and only when a TouchableOpacity wraps the card: the row stretches
     * that wrapper to the tallest card, but a column parent does not stretch children
     * on the main axis, so the card would keep its content height and the price row's
     * marginTop:'auto' would have nothing to push against.
     */
    cardFill: {
      flexGrow: 1,
    },
    // ADD: green on white. The design's button carries no border — only a shadow —
    // so the 1.5px stroke both controls inherit is zeroed out here.
    addInline: {
      backgroundColor: getColor('white'),
      borderWidth: 0,
      paddingHorizontal: 0,
    },
    // In-cart: the inverse — a filled green pill, `bg-secondary text-on-secondary`.
    stepperInline: {
      backgroundColor: PLP_ACCENT,
      borderColor: PLP_ACCENT,
      paddingHorizontal: 0,
    },
    // Lets the two-line "ADD / N OPTIONS" stack keep its own height.
    inlineCartControlAutoHeight: {
      height: 'auto',
      minHeight: 32,
    },
    unitContainer: {
      alignSelf: 'flex-start',
      marginHorizontal: 4,
      marginBottom: 2,
    },
    unit: {
      color: getColor('subText'),
      fontSize: getTypography('small'),
      lineHeight: getTypography('small') * 1.2,
    },

    name: {
      color: getColor('text'),
      // Keep a consistent two-line block height
      fontSize:
        size === 'xs'
          ? getTypography('caption') - 3
          : size === 'big'
            ? getTypography('body')
            : getTypography('caption') - 2,
      lineHeight:
        (size === 'xs'
          ? getTypography('caption') - 3
          : size === 'big'
            ? getTypography('body')
            : getTypography('caption') - 2) * 1.2,
      // Other sizes reserve two lines so prices align across a carousel. The PLP
      // grid lets the name take only the height it needs, which pulls the price up
      // under a one-line name; long names still wrap to two via numberOfLines.
      minHeight:
        size === 'big'
          ? undefined
          : (size === 'xs' ? getTypography('caption') - 3 : getTypography('caption') - 2) * 1.2 * 2,
      fontWeight: 'bold',
      flex: 1,
      // xs tracks the wider card so two-line names like "Sabudana Khichadi" use
      // the full width instead of truncating at the old 90px cap.
      maxWidth:
        size === 'xs'
          ? EXTRA_SMALL_CARD_WIDTH - 8
          : size === 'small'
            ? 110
            : size === 'big'
              ? 180
              : 130,
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'stretch',
      // `alignSelf: 'stretch'` already sizes this to the card minus its margins.
      // Adding width:'100%' on top makes the row 2*margin wider than the card, which
      // the card's overflow:'hidden' then clips on the right. Harmless while the row
      // held only left-aligned text; visible now that the cart control sits at its end.
      width: size === 'big' ? undefined : '100%',
      // Pinned to the bottom of the card in the grid. The row stretches its two cards to
      // a common height, so pushing the price down aligns the prices and ADD buttons
      // across the row however many lines each name takes.
      marginTop: size === 'big' ? 'auto' : undefined,
      marginHorizontal: size === 'xs' ? 2 : 4,
      marginBottom: size === 'xs' ? 4 : size === 'big' ? 4 : 8,
    },
    priceLeft: {
      flexDirection: size === 'big' ? 'column' : 'row',
      alignItems: size === 'big' ? 'flex-start' : 'center',
      // Without these the price block cannot compress, so on a narrow screen it
      // pushes the cart control past the card's edge and overflow:'hidden' clips it.
      flexShrink: 1,
      minWidth: 0,
    },
    mrp: {
      color: getColor('subText'),
      // Secondary to the price it sits under in the grid, and small enough that the
      // two lines together stay within the 30px cart control beside them.
      fontSize:
        size === 'xs'
          ? getTypography('caption') - 2
          : size === 'big'
            ? getTypography('small')
            : getTypography('caption'),
      lineHeight: size === 'big' ? getTypography('small') * 1.1 : undefined,
      textDecorationLine: 'line-through',
      // No trailing gap once stacked — that space belonged to the price beside it.
      marginRight: size === 'big' ? 0 : size === 'xs' ? 4 : 6,
    },
    price: {
      color: getColor('text'),
      fontSize:
        size === 'xs'
          ? getTypography('caption') - 2
          : size === 'big'
            ? getTypography('body')
            : getTypography('caption'),
      fontWeight: 'bold',
    },
    disabledOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 10,
    },
    outOfStockOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(202, 198, 198, 0.15)',
      zIndex: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    outOfStockText: {
      color: getColor('white'),
      fontSize: size === 'xs' ? getTypography('caption') - 2 : getTypography('caption'),
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    grayedOutImage: {
      width: '100%',
      height: '100%',
      borderRadius: theme.borderRadius.sm,
      opacity: 0.5,
    },
  });

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
  size = 'regular',
  disabled = false,
  showVariantsCount = false,
  onPress,
  backgroundColor,
  rating = 0,
  isStoreClosed = false,
}) => {
  const { getColor, getTypography, theme } = useTheme();

  // Memoize expensive calculations
  const {
    imageUrl: image,
    name,
    sellingPrice: price,
    mrp,
    discount,
    numberOfVariants,
    inStock,
    veg,
  } = product;

  const imageSource: ImageSourcePropType = useMemo(() => {
    if (typeof image === 'string' && image.trim()) {
      // Clean the URL by removing invalid characters and whitespace
      const cleanUrl = image.trim().replace(/^@+/, ''); // Remove leading @ symbols
      if (cleanUrl && cleanUrl.startsWith('http')) {
        return { uri: cleanUrl };
      }
    }
    if (image && typeof image === 'object') {
      return image;
    }
    return require('../../../assets/images/food.png');
  }, [image]);

  const styles = useMemo(
    () => createStyles(size, getColor, getTypography, theme, veg, backgroundColor),
    [size, getColor, getTypography, theme, veg, backgroundColor]
  );

  // AddButton and QuantitySelector have no 'big' variant — the two-up PLP grid is
  // roughly a 'regular' card's width, so its controls take the same size.
  const controlSize = size === 'big' ? 'regular' : size;

  /** The two-up PLP grid, which lays the card out differently from the carousels. */
  const isGrid = size === 'big';

  // Only safe inside the touchable: as a bare row child, flexGrow would stretch the
  // card horizontally and override its measured width.
  const fillsRowHeight = isGrid && !!onPress;

  /**
   * AddButton grows into a two-line "ADD / N OPTIONS" stack under exactly these
   * conditions. Pinning a height on that variant would squash it, so the inline
   * override drops the fixed height when the stack is showing.
   */
  const showsVariantStack = controlSize === 'regular' && showVariantsCount && numberOfVariants > 1;

  const showUnit = useMemo(
    () => size === 'big' && !!product.attributes?.unit?.trim(),
    [size, product.attributes?.unit]
  );

  const showMrp = useMemo(() => mrp !== price, [mrp, price]);
  const showDiscount = useMemo(() => discount > 0, [discount]);
  const showRating = useMemo(() => size !== 'xs', [size]);
  const isOutOfStock = useMemo(() => !inStock, [inStock]);
  const hasQuantity = useMemo(() => quantity > 0, [quantity]);

  const cartControl = !hasQuantity ? (
    <AddButton
      onPress={onAdd}
      size={controlSize}
      numberOfVariants={numberOfVariants}
      showVariantsCount={showVariantsCount}
      disabled={isStoreClosed}
      tintColor={isGrid ? PLP_ACCENT : undefined}
      // The design's button is the bare word "ADD".
      showPlusIcon={!isGrid}
      containerStyle={
        isGrid
          ? [
              styles.inlineCartControl,
              styles.addInline,
              showsVariantStack && styles.inlineCartControlAutoHeight,
            ]
          : undefined
      }
    />
  ) : (
    <QuantitySelector
      quantity={quantity}
      onIncrement={onIncrement}
      onDecrement={onDecrement}
      // 'small' rather than 'regular' in the grid: regular's ±/numeral hit targets
      // need ~96px of internal width and would overflow the 84px box the ADD button
      // sets. 'small' comes to ~80px and fits.
      size={isGrid ? 'small' : controlSize}
      disabled={isStoreClosed}
      // Filled green pill with white glyphs, inverting the ADD button.
      tintColor={isGrid ? PLP_ON_ACCENT : undefined}
      quantityColor={isGrid ? PLP_ON_ACCENT : undefined}
      containerStyle={isGrid ? [styles.inlineCartControl, styles.stepperInline] : undefined}
    />
  );

  const cardContent = (
    <View style={[styles.card, fillsRowHeight && styles.cardFill]}>
      {disabled && <View style={styles.disabledOverlay} />}
      {isOutOfStock && <View style={styles.outOfStockOverlay} />}

      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={[styles.image, isOutOfStock && styles.grayedOutImage]}
          resizeMode="cover"
          // Ensure proper image fitting
          onError={() => console.warn('Failed to load image:', image)}
          // Add fallback image
          defaultSource={require('../../../assets/images/food.png')}
          // Add loading indicator
        />

        {showRating && (
          <View style={styles.ratingBadge}>
            <RatingBadge
              rating={rating}
              size={size === 'regular' ? 'medium' : size === 'xs' ? 'small' : 'medium'}
            />
          </View>
        )}

        {showDiscount && (
          <View style={styles.badgeTag}>
            <BadgeTag
              text={`${discount}%`}
              variant="error"
              size={size === 'xs' ? 'small' : size === 'small' ? 'small' : 'medium'}
            />
          </View>
        )}

        {isOutOfStock || isStoreClosed ? (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>
              {isStoreClosed ? 'STORE CLOSED' : 'OUT OF STOCK'}
            </Text>
          </View>
        ) : (
          /* The PLP grid moves the control down into the price row, as in the QV PLP
             design; every other size keeps it overlaying the image. */
          !isGrid && cartControl
        )}
      </View>

      {/* Pack size sits above the name in the PLP grid, as in the QV PLP design.
          Only 'big' has the vertical room, and only some SKUs carry a unit. */}
      {showUnit && (
        <View style={styles.unitContainer}>
          <Text style={[styles.unit, isOutOfStock && { opacity: 0.6 }]} numberOfLines={1}>
            {product.attributes?.unit}
          </Text>
        </View>
      )}

      <View style={styles.nameContainer}>
        <Text style={[styles.name, isOutOfStock && { opacity: 0.6 }]} numberOfLines={2}>
          {name}
        </Text>
      </View>

      <View style={styles.priceRow}>
        {/* Side by side elsewhere, stacked in the grid. There the cart control takes 80
            of the row's ~130px, and "₹130 ₹100" needs about 70 on one line — it
            overflowed and the card's overflow:'hidden' sliced the price in half.
            Stacked, the column is only as wide as the longer of the two amounts. */}
        <View style={styles.priceLeft}>
          {isGrid ? (
            <>
              <Text style={[styles.price, isOutOfStock && { opacity: 0.6 }]} numberOfLines={1}>
                ₹{formatAmount(price ?? 0, isGrid)}
              </Text>
              {showMrp && (
                <Text style={[styles.mrp, isOutOfStock && { opacity: 0.6 }]} numberOfLines={1}>
                  ₹{formatAmount(mrp ?? 0, isGrid)}
                </Text>
              )}
            </>
          ) : (
            <>
              {showMrp && (
                <Text style={[styles.mrp, isOutOfStock && { opacity: 0.6 }]} numberOfLines={1}>
                  ₹{formatAmount(mrp ?? 0, isGrid)}
                </Text>
              )}
              <Text style={[styles.price, isOutOfStock && { opacity: 0.6 }]} numberOfLines={1}>
                ₹{formatAmount(price ?? 0, isGrid)}
              </Text>
            </>
          )}
        </View>
        {isGrid && !isOutOfStock && !isStoreClosed && cartControl}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

ProductCard.displayName = 'ProductCard';

export default memo(ProductCard);
