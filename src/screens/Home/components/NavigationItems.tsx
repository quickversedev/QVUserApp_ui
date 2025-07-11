import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeText } from '../../../components/common/theme/ThemeText';
import { useTab } from '../../../contexts/TabContext';
import { useTheme } from '../../../theme/ThemeContext';

type NavigationItem = {
  id: string;
  label: string;
  icon: string;
  screen: 'HomeMain' | 'ForYou' | 'food' | 'Grocery' | 'Pharmacy';
};

const navigationItems: NavigationItem[] = [
  { id: 'for-you', label: 'For You', icon: 'star', screen: 'ForYou' },
  { id: 'food', label: 'Food', icon: 'chef-hat', screen: 'food' },
  { id: 'grocery', label: 'Grocery', icon: 'shopping', screen: 'Grocery' },
  { id: 'pharmacy', label: 'Pharmacy', icon: 'pill', screen: 'Pharmacy' },
];

const ACTIVE_COLOR = '#FFD700'; // Brighter gold for active state

export const NavigationItems = () => {
  const { theme } = useTheme();
  const { selectedTab, setSelectedTab } = useTab();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {navigationItems.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[styles.item, selectedTab === item.screen && styles.selectedItem]}
          onPress={() => setSelectedTab(item.screen)}
        >
          <View style={styles.tabContent}>
            <Icon
              name={item.icon}
              size={22}
              color={selectedTab === item.screen ? ACTIVE_COLOR : theme.colors.subText}
            />
            <ThemeText
              variant="caption"
              color={selectedTab === item.screen ? ACTIVE_COLOR : theme.colors.subText}
              style={styles.label}
            >
              {item.label}
            </ThemeText>
          </View>
          {selectedTab === item.screen && (
            <View style={[styles.selectedIndicator, { backgroundColor: ACTIVE_COLOR }]} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingTop: 12,
  },
  item: {
    flex: 1,
    position: 'relative',
    height: 55,
  },
  selectedItem: {
    transform: [{ scale: 1.05 }],
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  label: {
    fontSize: 11,
    marginTop: 4,
  },
});
