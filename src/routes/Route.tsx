import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';

import AppStack from './AppStack';
import { AuthStack } from './AuthStack';
import { useAuth } from '../contexts/login/AuthProvider';
import ForceUpdateChecker from '../components/common/ForceUpdate';

export const Router = () => {
  const { authData, loading, skipUserLogin } = useAuth();
  console.log('Auth Data:', authData);
  if (loading) {
    return <Text>Loading</Text>;
  }
  return (
    <NavigationContainer>
      <ForceUpdateChecker>
        {authData || skipUserLogin ? <AppStack /> : <AuthStack />}
      </ForceUpdateChecker>
    </NavigationContainer>
  );
};
