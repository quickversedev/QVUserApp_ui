import React, { useEffect } from 'react';
import TabNavigation from '../navigation/TabNavigation';
import { useLocationPermission } from '../hooks/Permissions/usePermissions';

const AppStack = () => {
  const { isLoading, location, isDenied, handleDeniedPermissionModal } = useLocationPermission();
  console.log('Location isDenied:', isLoading, location);
  useEffect(() => {
    if (isDenied) handleDeniedPermissionModal();
  }, [isDenied]);
  return <TabNavigation />;
};

export default AppStack;
