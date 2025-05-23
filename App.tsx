import React, {useEffect} from 'react';
import {AuthProvider} from './src/contexts/login/AuthProvider';
import {Router} from './src/routes/Route';
import {ThemeProvider} from './src/theme/ThemeContext';
import PermissionsScreen from './src/screens/permission/PermissionsScreen';
import {useLocationPermission} from './src/hooks/Permissions/usePermissions';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useFirstLaunch} from './src/utils/global/firstLaunch';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

function App(): React.JSX.Element {
  const {
    isLoading,
    location,
    isGranted,
    isDenied,
    requestLocationPermission,
    hasSkippedLocation,
    skipLocationPermission,
    getCurrentLocation,
  } = useLocationPermission();
  useEffect(() => {
    if (!isLoading && !isDenied) {
      getCurrentLocation();
    }
  }, [isDenied, hasSkippedLocation]);
  const isFirstLaunch = useFirstLaunch();

  if (isLoading || isFirstLaunch === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Checking app permissions...</Text>
      </View>
    );
  }

  const renderContent = () => {
    // If permission is granted, show the app
    if (isGranted || hasSkippedLocation) {
      return <Router />;
    }

    if (isFirstLaunch) {
      return (
        <PermissionsScreen
          onSkip={skipLocationPermission}
          onRequestPermission={requestLocationPermission}
        />
      );
    }

    return <Router />;
  };

  return (
    <ThemeProvider>
      <AuthProvider>{renderContent()}</AuthProvider>
    </ThemeProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusText: {
    marginBottom: 20,
    fontSize: 16,
  },
});
