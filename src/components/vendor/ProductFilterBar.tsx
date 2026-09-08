import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Product } from '../../types/product';
import { ThemeText } from '../common/theme/ThemeText';

/**
 * Filter and sort controls for a vendor's product list.
 *
 * Everything here runs against the catalogue already in memory — VendorProduct fetches
 * the shop's products in one call — so toggling a chip is instant and needs no request,
 * no loading state and no cache invalidation.
 *
 * Sorts and filters share one scrolling row: with only four orderings, a chip each is
 * cheaper to reach than a sheet, and the current ordering stays visible instead of
 * hiding behind a "Sort by" label. Sort chips are single-select (a list has one order),
 * filter chips stack.
 *
 * Deliberately excluded, though the QV PLP design shows them: a delivery-time chip and
 * a store chip. Delivery time is a property of the vendor, so inside one vendor's list
 * it is the same for every product and filters nothing, and the store is the one you
 * are already in. Both only make sense on a category page that spans vendors.
 */

export interface ProductFilterDef {
  id: string;
  label: string;
  matches: (product: Product) => boolean;
  /**
   * Filters sharing a group are mutually exclusive — nothing is both vegetarian and
   * not, so letting the two stack would only ever empty the list.
   */
  group?: string;
}

export interface ProductSortDef {
  id: string;
  /** Chip text — kept short, since it sits inline with the filters. */
  label: string;
  /** Spelled out for screen readers, where the arrow glyphs do not read well. */
  accessibilityLabel: string;
  compare: (a: Product, b: Product) => number;
}

/** Minimum discount for the offers chip, as a percentage. */
const MIN_DISCOUNT = 30;
/** Minimum rating for the well-rated chip. */
const MIN_RATING = 4;
/** Below this many priced items a "cheap" band is not a meaningful division. */
const MIN_PRODUCTS_FOR_PRICE_BAND = 4;

/** Round a rupee amount up to a value a shopper would recognise as a price band. */
const niceCeiling = (value: number): number => {
  const steps = [10, 20, 25, 30, 40, 50, 60, 75, 100, 125, 150, 200, 250, 300, 400, 500, 750, 1000];
  return steps.find(step => step >= value) ?? Math.ceil(value / 500) * 500;
};

/**
 * Build the filter set for one vendor's catalogue.
 *
 * The price band is derived rather than fixed: a hardcoded "Under ₹50" is dead weight
 * at a restaurant where nothing costs less than ₹110, and trivially true at a kirana
 * where everything does. Taking roughly the cheaper third of *this* vendor's range and
 * rounding to a recognisable number gives a chip that always divides the list.
 *
 * Only filters that match at least one product are returned, so a chip can never empty
 * the list on its own — the same guarantee the server's `nonEmpty=true` gives the tag
 * vocabulary.
 */
export const buildProductFilters = (products: Product[]): ProductFilterDef[] => {
  const candidates: ProductFilterDef[] = [
    // Explicit true/false only. An unclassified product (null/undefined) belongs in
    // neither bucket, so it is excluded from both rather than defaulting to one.
    { id: 'veg', label: 'Veg', matches: p => p.veg === true, group: 'diet' },
    { id: 'non-veg', label: 'Non-veg', matches: p => p.veg === false, group: 'diet' },
    {
      id: 'discounted',
      label: `${MIN_DISCOUNT}%+ OFF`,
      matches: p => (p.discount ?? 0) >= MIN_DISCOUNT,
    },
    { id: 'well-rated', label: `${MIN_RATING}★+`, matches: p => (p.rating ?? 0) >= MIN_RATING },
  ];

  // 0 means unpriced rather than free, so those SKUs cannot inform the band.
  const prices = products
    .map(p => p.sellingPrice)
    .filter(price => price > 0)
    .sort((a, b) => a - b);

  if (prices.length >= MIN_PRODUCTS_FOR_PRICE_BAND) {
    const threshold = niceCeiling(prices[Math.floor(prices.length * 0.34)]);
    // Only worth offering if it actually splits the catalogue in two.
    if (prices.some(p => p <= threshold) && prices.some(p => p > threshold)) {
      candidates.unshift({
        id: 'under-price',
        label: `Under ₹${threshold}`,
        matches: p => p.sellingPrice > 0 && p.sellingPrice <= threshold,
      });
    }
  }

  return candidates.filter(filter => products.some(filter.matches));
};

const ALL_SORTS: (ProductSortDef & { varies: (products: Product[]) => boolean })[] = [
  {
    id: 'price-asc',
    label: 'Price ↑',
    accessibilityLabel: 'Sort by price, low to high',
    compare: (a, b) => a.sellingPrice - b.sellingPrice,
    varies: ps => new Set(ps.map(p => p.sellingPrice)).size > 1,
  },
  {
    id: 'price-desc',
    label: 'Price ↓',
    accessibilityLabel: 'Sort by price, high to low',
    compare: (a, b) => b.sellingPrice - a.sellingPrice,
    varies: ps => new Set(ps.map(p => p.sellingPrice)).size > 1,
  },
  {
    id: 'discount',
    label: 'Discount',
    accessibilityLabel: 'Sort by discount',
    compare: (a, b) => (b.discount ?? 0) - (a.discount ?? 0),
    varies: ps => ps.some(p => (p.discount ?? 0) > 0),
  },
  {
    id: 'rating',
    label: 'Rating',
    accessibilityLabel: 'Sort by rating',
    compare: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
    // /v3/products returns no rating field at all and qv.rating is empty, so this
    // currently never renders. Kept, rather than deleted, so it reappears on its own
    // if the server starts populating ratings.
    varies: ps => ps.some(p => (p.rating ?? 0) > 0),
  },
];

/**
 * The orderings worth offering for this catalogue.
 *
 * A sort whose field is identical across every product does nothing when tapped —
 * the comparator returns 0 for every pair and the list visibly does not move. Rather
 * than let a chip lie about what it does, it is not shown at all, matching the rule
 * buildProductFilters applies to filters.
 */
export const buildProductSorts = (products: Product[]): ProductSortDef[] =>
  ALL_SORTS.filter(sort => sort.varies(products)).map(
    ({ id, label, accessibilityLabel, compare }) => ({ id, label, accessibilityLabel, compare })
  );

interface ProductFilterBarProps {
  activeFilterIds: string[];
  onToggleFilter: (id: string) => void;
  activeSortId: string | null;
  onChangeSort: (id: string | null) => void;
  /**
   * The vendor's applicable filters, from buildProductFilters. Already narrowed to
   * those matching at least one product, so a chip can never empty the list — a
   * butcher is not offered a Veg filter.
   */
  filters: ProductFilterDef[];
  /** The catalogue's usable orderings, from buildProductSorts. */
  sorts: ProductSortDef[];
  disabled?: boolean;
}

const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  activeFilterIds,
  onToggleFilter,
  activeSortId,
  onChangeSort,
  filters,
  sorts,
  disabled = false,
}) => {
  const { getColor, getTypography } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        /**
         * On the ScrollView itself, not its content. A horizontal ScrollView sitting in
         * a column flex parent still stretches on the cross axis, so without flexGrow:0
         * it claims all the leftover height and pushes the product grid far down the
         * screen. The explicit height keeps the row to exactly one chip tall.
         */
        bar: {
          flexGrow: 0,
          flexShrink: 0,
          height: 46,
        },
        barContent: {
          paddingHorizontal: 12,
          paddingVertical: 8,
          alignItems: 'center',
        },
        chip: {
          flexDirection: 'row',
          alignItems: 'center',
          height: 30,
          paddingHorizontal: 12,
          borderRadius: 15,
          borderWidth: 1,
          borderColor: getColor('border'),
          backgroundColor: getColor('card'),
          marginRight: 8,
        },
        chipActive: {
          borderColor: getColor('primary'),
          backgroundColor: getColor('primary'),
        },
        chipText: {
          fontSize: getTypography('small'),
          color: getColor('text'),
          fontWeight: '600',
        },
        chipTextActive: {
          color: getColor('white'),
        },
        /** Separates the single-select sorts from the stackable filters. */
        divider: {
          width: 1,
          height: 18,
          backgroundColor: getColor('border'),
          marginRight: 8,
        },
        disabled: {
          opacity: 0.5,
        },
      }),
    [getColor, getTypography]
  );

  const renderChip = (
    key: string,
    label: string,
    a11yLabel: string,
    active: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      key={key}
      style={[styles.chip, active && styles.chipActive, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={a11yLabel}
    >
      <ThemeText style={[styles.chipText, active && styles.chipTextActive]}>{label}</ThemeText>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.bar}
      contentContainerStyle={styles.barContent}
      keyboardShouldPersistTaps="handled"
    >
      {sorts.map(sort =>
        renderChip(sort.id, sort.label, sort.accessibilityLabel, sort.id === activeSortId, () =>
          // Tapping the active ordering clears it, back to the vendor's own order.
          onChangeSort(sort.id === activeSortId ? null : sort.id)
        )
      )}
      {sorts.length > 0 && filters.length > 0 ? <View style={styles.divider} /> : null}
      {filters.map(filter =>
        renderChip(filter.id, filter.label, filter.label, activeFilterIds.includes(filter.id), () =>
          onToggleFilter(filter.id)
        )
      )}
    </ScrollView>
  );
};

export default React.memo(ProductFilterBar);
