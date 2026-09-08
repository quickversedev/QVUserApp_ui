import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { useTheme } from '../../../theme/ThemeContext';
import { triggerAddToCartHaptic } from '../../../utils/haptics';
import { ThemeText } from '../../common/theme/ThemeText';

interface AddButtonProps {
  onPress: () => void;
  size?: 'xs' | 'small' | 'regular';
  numberOfVariants?: number;
  showVariantsCount?: boolean;
  disabled?: boolean;
  /**
   * Overrides on the root container, mirroring QuantitySelector's prop of the same
   * name. The default style absolutely positions this bottom-right inside a
   * ProductCard image; pass this to re-place it elsewhere (the PLP grid puts it
   * inline at the right of the price row).
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Overrides the border/text/icon colour, which otherwise follows the theme's
   * primary. The PLP grid uses it for the QV PLP design's green treatment.
   */
  tintColor?: string;
  /**
   * The trailing "+" glyph beside the ADD label. The QV PLP design's button is the
   * word alone, so the grid turns it off.
   */
  showPlusIcon?: boolean;
}

const AddButton: React.FC<AddButtonProps> = ({
  onPress,
  size = 'regular',
  numberOfVariants = 1,
  showVariantsCount = false,
  disabled = false,
  containerStyle,
  tintColor,
  showPlusIcon = true,
}) => {
  const { getColor, getTypography, theme } = useTheme();
  const tint = tintColor ?? getColor('primary');

  const hasMultipleVariants = numberOfVariants > 1;
  const shouldShowBadge = (size === 'small' || size === 'xs') && hasMultipleVariants;
  const shouldShowVariantsCount = size === 'regular' && showVariantsCount && hasMultipleVariants;

  const handleSafePress = () => {
    if (disabled) {
      return;
    }
    triggerAddToCartHaptic();
    onPress();
  };

  // Unified dimensions matching QuantitySelector
  const buttonWidth = size === 'xs' ? 52 : size === 'small' ? 70 : 80;
  const buttonHeight = size === 'xs' ? 24 : size === 'small' ? 32 : 36;

  const styles = StyleSheet.create({
    addButton: {
      position: 'absolute',
      right: 2,
      bottom: 2,
      borderWidth: 1.5,
      borderColor: tint,
      borderRadius: theme.borderRadius.sm,
      minWidth: buttonWidth,
      height: buttonHeight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: getColor('card'),
      zIndex: 3,
      shadowColor: theme.colors.shadow.color,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.colors.shadow.opacity,
      shadowRadius: theme.colors.shadow.radius,
      elevation: 2,
    },
    addButtonWithVariants: {
      flexDirection: 'column',
      minHeight: size === 'xs' ? 36 : size === 'small' ? 40 : 44,
      height: 'auto',
    },
    addButtonText: {
      color: tint,
      fontWeight: '600',
      marginLeft: 2,
    },
    addButtonTextWithVariants: {
      marginLeft: 0,
    },
    addButtonTextXs: {
      color: tint,
      fontWeight: '700',
      fontSize: getTypography('small') - 2,
      marginLeft: 1,
    },
    variantsText: {
      color: getColor('subText'),
      fontSize:
        size === 'xs'
          ? getTypography('small') - 8
          : size === 'small'
            ? getTypography('small') - 6
            : getTypography('small') - 5,
      fontWeight: '500',
      fontFamily: 'BricolageGrotesque-Regular',
      textAlign: 'center',
    },
    divider: {
      width: '80%',
      height: 1,
      backgroundColor: getColor('border'),
      marginVertical: 2,
    },
    badge: {
      position: 'absolute',
      top: -8,
      right: -5,
      backgroundColor: getColor('error'),
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 4,
      borderWidth: 2,
      borderColor: getColor('card'),
    },
    badgeText: {
      color: getColor('white'),
    },
  });

  // Small button with variants - show badge
  if (shouldShowBadge) {
    return (
      <>
        <TouchableOpacity style={[styles.addButton, containerStyle]} onPress={handleSafePress}>
          <MaterialCommunityIcons name="plus" size={18} color={tint} />
          <View style={styles.badge}>
            <ThemeText variant="small" color={getColor('white')} style={styles.badgeText}>
              {numberOfVariants}
            </ThemeText>
          </View>
        </TouchableOpacity>
      </>
    );
  }

  // Regular button with variants - show "X OPTIONS"
  if (shouldShowVariantsCount) {
    return (
      <>
        <TouchableOpacity
          style={[styles.addButton, styles.addButtonWithVariants, containerStyle]}
          onPress={handleSafePress}
        >
          <ThemeText
            variant="caption"
            color={tint}
            style={[styles.addButtonText, styles.addButtonTextWithVariants]}
          >
            ADD
          </ThemeText>
          <View style={styles.divider} />
          <Text style={styles.variantsText}>{numberOfVariants} OPTIONS</Text>
        </TouchableOpacity>
      </>
    );
  }

  // Default buttons (no variants or single variant)
  return (
    <>
      <TouchableOpacity style={[styles.addButton, containerStyle]} onPress={handleSafePress}>
        {size === 'xs' ? (
          <>
            <MaterialCommunityIcons name="plus" size={13} color={tint} />
            <ThemeText variant="caption" color={tint} style={styles.addButtonTextXs}>
              Add
            </ThemeText>
          </>
        ) : size === 'small' ? (
          <MaterialCommunityIcons name="plus" size={18} color={tint} />
        ) : (
          <>
            <ThemeText variant="caption" color={tint} style={styles.addButtonText}>
              ADD
            </ThemeText>
            {showPlusIcon && <MaterialCommunityIcons name="plus" size={16} color={tint} />}
          </>
        )}
      </TouchableOpacity>
    </>
  );
};

export default AddButton;
