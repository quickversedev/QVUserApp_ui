import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { NavigationItems } from '../../../screens/Home/components/NavigationItems';
import { useTheme } from '../../../theme/ThemeContext';
import { LocationSelector } from './LocationSelector';
import { ProfileIcon } from './ProfileIcon';
import { SearchBar } from './SearchBar';

export const Header = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Section 1: Top Row */}
        <View style={styles.topRow}>
          <LocationSelector />
          <ProfileIcon />
        </View>

        {/* Section 2: Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar />
        </View>

        {/* Section 3: Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/logo_qv.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Section 4: Navigation Tabs */}
      <View style={[styles.tabContainer, { borderBottomColor: theme.colors.border }]}>
        <NavigationItems />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchSection: {
    width: '100%',
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
