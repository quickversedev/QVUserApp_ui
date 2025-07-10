import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/login/AuthProvider';
import { useLocationPermission } from '../hooks/Permissions/usePermissions';
import { useNotifications } from '../hooks/useNotifications';
import TabNavigation from '../navigation/TabNavigation';
import Registration from '../screens/login/Registration';
import ProfileScreen from '../screens/profile/profileScreen';

export type RootStackParamList = {
  MainApp: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppStack = () => {
  const { isDenied, handleDeniedPermissionModal } = useLocationPermission();
  const { isNewUser } = useAuth();
  const { requestPermissions } = useNotifications();

  useEffect(() => {
    if (isDenied) {
      handleDeniedPermissionModal();
    }
    requestPermissions();
  }, [handleDeniedPermissionModal, isDenied, requestPermissions]);

  if (isNewUser) {
    return <Registration />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainApp" component={TabNavigation} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
