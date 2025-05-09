import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import OTPScreen from '../screens/Login/OTPScreen';
import LoginScreen from '../screens/Login/loginScreen';

export type LoginStackParamList = {
  LoginScreen: undefined;
  OTPScreen: {phoneNumber: string; verificationId: string};
};

const Stack = createStackNavigator();

const LoginStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
    </Stack.Navigator>
  );
};

export default LoginStackNavigator;
