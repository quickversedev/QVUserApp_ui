import React from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { NavigationItems } from '../../../screens/Home/components/NavigationItems';
import { useTheme } from '../../../theme/ThemeContext';
import { LocationSelector } from './LocationSelector';
import { ProfileIcon } from './ProfileIcon';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  translateY?: Animated.AnimatedInterpolation<number>;
  hiddenSectionsOpacity?: Animated.AnimatedInterpolation<number>;
}

export const Header: React.FC<HeaderProps> = ({ translateY, hiddenSectionsOpacity }) => {
  const { theme } = useTheme();

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        translateY ? { transform: [{ translateY }] } : undefined,
      ]}
    >
      {/* Sections that will be hidden on scroll */}
      <Animated.View
        style={[
          styles.hiddenSections,
          hiddenSectionsOpacity ? { opacity: hiddenSectionsOpacity } : undefined,
        ]}
      >
        {/* Section 1: Top Row */}
        <View style={styles.topRow}>
          <LocationSelector />
          <ProfileIcon />
        </View>

        {/* Section 3: Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/logo_qv.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* Sections that will remain visible */}
      <View style={styles.visibleSections}>
        {/* Section 2: Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar />
        </View>

        {/* Section 4: Navigation Tabs */}
        <View style={[styles.tabContainer, { borderBottomColor: theme.colors.border }]}>
          <NavigationItems />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  hiddenSections: {
    paddingHorizontal: 16,
    paddingTop: 12, // Slightly increased top padding
  },
  visibleSections: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchSection: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 200,
    height: 40,
  },
  tabContainer: {
    borderBottomWidth: 3,
  },
});
