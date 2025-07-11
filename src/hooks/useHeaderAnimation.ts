import { useCallback, useContext, useRef } from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { TabBarVisibilityContext } from '../navigation/TabNavigation';

export const useHeaderAnimation = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 180; // Approximate height of sections 1 and 3 combined
  const tabBarContext = useContext(TabBarVisibilityContext);

  const translateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      scrollY.setValue(offsetY);

      // Update tab bar animation if context exists
      if (tabBarContext?.scrollY) {
        tabBarContext.scrollY.setValue(offsetY);
      }
    },
    [scrollY, tabBarContext]
  );

  return {
    scrollY,
    translateY,
    opacity,
    handleScroll,
  };
};
