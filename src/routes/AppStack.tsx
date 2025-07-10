import React, { useEffect } from 'react';
import { useAuth } from '../contexts/login/AuthProvider';
import { useLocationPermission } from '../hooks/Permissions/usePermissions';
import TabNavigation from '../navigation/TabNavigation';
import Registration from '../screens/login/Registration';

const AppStack = () => {
  const { isLoading, location, isDenied, handleDeniedPermissionModal } = useLocationPermission();
  console.log('Location isDenied:', isLoading, location);
  const { isNewUser } = useAuth();
  if (isNewUser) {
    return <Registration />;
  }
  useEffect(() => {
    if (isDenied) handleDeniedPermissionModal();
  }, [isDenied]);
  return <TabNavigation />;
};

export default AppStack;
