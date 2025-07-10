import React from 'react';
import { Text } from 'react-native';
import ForceUpdateChecker from '../components/common/ForceUpdate';
import { useAuth } from '../contexts/login/AuthProvider';
import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';

export const Route = () => {
  const { authData, loading, skipUserLogin } = useAuth();

  if (loading) {
    return <Text>Loading</Text>;
  }

  return (
    <ForceUpdateChecker>
      {authData || skipUserLogin ? <AppStack /> : <AuthStack />}
    </ForceUpdateChecker>
  );
};
