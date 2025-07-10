import React, { useEffect } from 'react';
import { useAuth } from '../contexts/login/AuthProvider';
import { useLocationPermission } from '../hooks/Permissions/usePermissions';
import { useNotifications } from '../hooks/useNotifications';
import TabNavigation from '../navigation/TabNavigation';
import Registration from '../screens/login/Registration';

const AppStack = () => {
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

  return <TabNavigation />;
};

export default AppStack;
