import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { createContext, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DummyScreen1 from '../screens/Home/DummyScreen1';
import DummyScreen2 from '../screens/Home/DummyScreen2';
import HomeScreen from '../screens/Home/HomeScreen';
import { useTheme } from '../theme/ThemeContext';

export const TabBarVisibilityContext = createContext<Animated.Value | null>(null);

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;
  const { getColor } = useTheme();

  return (
    <TabBarVisibilityContext.Provider value={tabBarTranslateY}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            transform: [{ translateY: tabBarTranslateY }],
            backgroundColor: getColor('tabBackground'),
            borderTopColor: getColor('border'),
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: getColor('primary'),
          tabBarInactiveTintColor: getColor('subText'),
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="For You"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Food"
          component={DummyScreen1}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="food" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Grocery"
          component={DummyScreen2}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="cart" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </TabBarVisibilityContext.Provider>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default TabNavigation;
