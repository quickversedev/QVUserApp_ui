import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Text} from 'react-native';

import AppStack from './AppStack';
import {AuthStack} from './AuthStack';
import {useAuth} from '../contexts/login/AuthProvider';

export const Router = () => {
  const {authData, loading} = useAuth();
  console.log('Auth Data:', authData);
  if (loading) {
    return <Text>Loading</Text>;
  }
  return (
    <NavigationContainer>
      {authData ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
