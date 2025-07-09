import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionSpecs,
} from '@react-navigation/stack';
import OTPScreen from '../screens/login/OTPScreen';
import LoginScreen from '../screens/login/loginScreen';
import Registration from '../screens/login/registration';
import { Easing, Platform } from 'react-native';

export type LoginStackParamList = {
  LoginScreen: undefined;
  OTPScreen: { phoneNumber: string; verificationId: string };
};

const Stack = createStackNavigator();

const LoginStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerShown: false,
        // Platform-specific animations
        cardStyleInterpolator: Platform.select({
          ios: CardStyleInterpolators.forHorizontalIOS,
          android: CardStyleInterpolators.forScaleFromCenterAndroid,
        }),
        // Platform-specific transition specs
        transitionSpec: Platform.select({
          ios: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec,
          },
          android: {
            open: TransitionSpecs.FadeInFromBottomAndroidSpec,
            close: TransitionSpecs.FadeOutToBottomAndroidSpec,
          },
        }),
      }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
    </Stack.Navigator>
  );
};

export default LoginStackNavigator;
