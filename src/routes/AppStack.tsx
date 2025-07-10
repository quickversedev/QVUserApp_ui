import React, { useEffect } from 'react';
import { useAuth } from '../contexts/login/AuthProvider';
import { useLocationPermission } from '../hooks/Permissions/usePermissions';
import TabNavigation from '../navigation/TabNavigation';
import Registration from '../screens/login/Registration';

const AppStack = () => {
  const { isDenied, handleDeniedPermissionModal } = useLocationPermission();
  const { isNewUser } = useAuth();

  useEffect(() => {
    if (isDenied) handleDeniedPermissionModal();
  }, [handleDeniedPermissionModal, isDenied]);

  if (isNewUser) {
    return <Registration />;
  }

  return <TabNavigation />;
};

export default AppStack;
