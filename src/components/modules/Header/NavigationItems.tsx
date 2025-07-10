import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeStackParamList } from '../../../navigation/HomeNavigation';
import { useTheme } from '../../../theme/ThemeContext';
import { ThemeText } from '../../common/theme/ThemeText';

type NavigationItem = {
  id: string;
  label: string;
  icon: string;
  screen: keyof HomeStackParamList;
};

const navigationItems: NavigationItem[] = [
  { id: 'for-you', label: 'For You', icon: 'star-outline', screen: 'ForYou' },
  { id: 'food', label: 'Food', icon: 'cart-outline', screen: 'food' },
  { id: 'grocery', label: 'Grocery', icon: 'shopping-outline', screen: 'Grocery' },
  { id: 'pharmacy', label: 'Pharmacy', icon: 'medical-bag', screen: 'Pharmacy' },
];

export const NavigationItems = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

  return (
    <View style={styles.container}>
      {navigationItems.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.item}
          onPress={() => {
            if (item.screen !== 'HomeMain') {
              navigation.navigate(item.screen);
            }
          }}
        >
          <Icon name={item.icon} size={24} color={theme.colors.subText} />
          <ThemeText variant="caption" color={theme.colors.subText} style={styles.label}>
            {item.label}
          </ThemeText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  item: {
    alignItems: 'center',
  },
  label: {
    marginTop: 4,
  },
});
