import React, { createContext, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from '../screens/profile/profileScreen';
import DummyScreen1 from '../screens/Home/DummyScreen1';
import DummyScreen2 from '../screens/Home/DummyScreen2';
import DummyScreen3 from '../screens/Home/DummyScreen3';

const Tab = createBottomTabNavigator();

export const TabBarVisibilityContext = createContext<Animated.Value | null>(null);

const TabNavigation: React.FC = () => {
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();

  return (
    <TabBarVisibilityContext.Provider value={tabBarTranslateY}>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: [
              {
                backgroundColor: theme.colors.tabBackground,
                borderTopLeftRadius: theme.borderRadius.sm,
                borderTopRightRadius: theme.borderRadius.sm,
                height: 70,
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                borderTopWidth: 0,
                elevation: 12,
                shadowColor: theme.colors.shadow.color,
                shadowOffset: theme.colors.shadow.offset,
                shadowOpacity: theme.colors.shadow.opacity,
                shadowRadius: theme.colors.shadow.radius,
                transform: [{ translateY: tabBarTranslateY }],
              },
            ],
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.text,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home-outline" color={color} size={30} />
              ),
            }}
          />

          <Tab.Screen
            name="Dummy2"
            component={DummyScreen2}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="heart-outline" color={color} size={28} />
              ),
            }}
          />
          <Tab.Screen
            name="Dummy3"
            component={DummyScreen3}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="earth" color={color} size={28} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Settings',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="cog" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </TabBarVisibilityContext.Provider>
  );
};

export default TabNavigation;
