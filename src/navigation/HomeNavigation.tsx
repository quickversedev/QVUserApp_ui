import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ForYouScreen } from '../screens/Home/ForYouScreen';
import { GroceryScreen } from '../screens/Home/GroceryScreen';
import HomeMainScreen from '../screens/Home/HomeMainScreen';
import { PharmacyScreen } from '../screens/Home/PharmacyScreen';
import FoodScreen from '../screens/Home/foodScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  ForYou: undefined;
  Grocery: undefined;
  Pharmacy: undefined;
  food: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeMainScreen} />
      <Stack.Screen name="ForYou" component={ForYouScreen} />
      <Stack.Screen name="Grocery" component={GroceryScreen} />
      <Stack.Screen name="Pharmacy" component={PharmacyScreen} />
      <Stack.Screen name="food" component={FoodScreen} />
    </Stack.Navigator>
  );
};
