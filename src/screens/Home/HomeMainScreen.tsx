import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { Header } from '../../components/modules/Header/Header';
import { useTab } from '../../contexts/TabContext';
import { useTheme } from '../../theme/ThemeContext';
import { FoodContent } from './components/tabs/FoodContent';
import { ForYouContent } from './components/tabs/ForYouContent';
import { GroceryContent } from './components/tabs/GroceryContent';
import { HomeContent } from './components/tabs/HomeContent';
import { PharmacyContent } from './components/tabs/PharmacyContent';

const HomeMainScreen = () => {
  const { selectedTab } = useTab();
  const { theme } = useTheme();

  const renderContent = () => {
    switch (selectedTab || 'ForYou') {
      case 'food':
        return <FoodContent />;
      case 'Grocery':
        return <GroceryContent />;
      case 'Pharmacy':
        return <PharmacyContent />;
      case 'HomeMain':
        return <HomeContent />;
      case 'ForYou':
      default:
        return <ForYouContent />;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header />
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
  },
  container: {
    flex: 1,
  },
});

export default HomeMainScreen;
