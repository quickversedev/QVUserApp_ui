import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { LocationSelector } from './LocationSelector';
import { NavigationItems } from './NavigationItems';
import { ProfileIcon } from './ProfileIcon';
import { SearchBar } from './SearchBar';

export const Header = () => {
  const { getColor } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getColor('background') }]}>
      <View style={styles.topSection}>
        <LocationSelector />
        <ProfileIcon />
      </View>
      <SearchBar />
      <NavigationItems />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
