import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

interface VegIconProps {
  veg: boolean;
  size?: 'xs' | 'small' | 'regular';
  /**
   * Fills the mark's interior instead of letting the background show through. Needed
   * when it sits on a photo — over food imagery a transparent interior leaves the
   * border and dot competing with whatever is behind them.
   */
  filled?: boolean;
}

// eslint-disable-next-line react/prop-types
const VegIcon: React.FC<VegIconProps> = memo(({ veg, size = 'regular', filled = false }) => {
  const styles = StyleSheet.create({
    container: {
      width: size === 'xs' ? 14 : 18,
      height: size === 'xs' ? 14 : 18,
      borderWidth: 1.5,
      borderRadius: 4,
      borderColor: veg ? '#4CAF50' : '#FF6B6B',
      backgroundColor: filled ? '#FFFFFF' : 'transparent',
      marginRight: size === 'xs' ? 4 : 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    vegCircle: {
      width: size === 'xs' ? 6 : 8,
      height: size === 'xs' ? 6 : 8,
      borderRadius: size === 'xs' ? 3 : 4,
      backgroundColor: '#4CAF50',
    },
    nonVegTriangle: {
      width: 0,
      height: 0,
      // Always transparent: the triangle is drawn from this element's borders, so a
      // fill here would sit behind the shape rather than inside the mark. `filled`
      // belongs on the container, which is the box the mark actually occupies.
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: size === 'xs' ? 3 : 4,
      borderRightWidth: size === 'xs' ? 3 : 4,
      borderBottomWidth: size === 'xs' ? 6 : 8,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: '#FF6B6B',
    },
  });

  return (
    <View style={styles.container}>
      {veg ? <View style={styles.vegCircle} /> : <View style={styles.nonVegTriangle} />}
    </View>
  );
});

VegIcon.displayName = 'VegIcon';

export default VegIcon;
