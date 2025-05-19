import {useEffect, useState} from 'react';
import {Alert, AppState, Platform} from 'react-native';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {
  getSkipPermission,
  setSkipPermissions,
} from '../../services/localStorage/storage.service';

type Location = {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
};

export const useLocationPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(
    RESULTS.UNAVAILABLE,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [hasSkippedLocation, setHasSkippedLocation] = useState<boolean>(false);

  const locationPermission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  const checkLocationPermission = async () => {
    if (hasSkippedLocation) return RESULTS.DENIED;

    setIsLoading(true);
    try {
      const result = await check(locationPermission);
      setPermissionStatus(result);
      return result;
    } catch (error) {
      console.error('Error checking location permission:', error);
      setPermissionStatus(RESULTS.UNAVAILABLE);
      return RESULTS.UNAVAILABLE;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (hasSkippedLocation) {
      setLocation({
        latitude: null,
        longitude: null,
        error: 'Location permission skipped by user',
      });
      return;
    }

    setIsLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
        setIsLoading(false);
      },
      error => {
        setLocation({
          latitude: null,
          longitude: null,
          error: error.message,
        });
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const requestLocationPermission = async () => {
    setIsLoading(true);
    try {
      const result = await request(locationPermission);
      setPermissionStatus(result);
      // If user grants permission, reset the skipped flag
      if (result === RESULTS.GRANTED) {
        handleSkipPermission();
      }
      return result;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setPermissionStatus(RESULTS.UNAVAILABLE);
      return RESULTS.UNAVAILABLE;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeniedPermissionModal = () => {
    Alert.alert(
      'Permission Required',
      'We need access to your location to provide accurate results and personalized services. Please enable location permissions in your device settings.',
      [
        {
          text: 'Skip',
          onPress: () => {
            handleSkipPermission();
            setPermissionStatus(RESULTS.DENIED);
          },
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () =>
            openSettings().catch(() => console.warn('Cannot open settings')),
        },
      ],
    );
  };

  const handleSkipPermission = () => {
    setSkipPermissions(true);
    setHasSkippedLocation(true);
  };

  const skipLocationPermission = () => {
    handleSkipPermission();
    setPermissionStatus(RESULTS.DENIED);
    setLocation({
      latitude: null,
      longitude: null,
      error: 'Location permission skipped by user',
    });
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkLocationPermission();
      }
    });

    checkLocationPermission();
    const hasSkippedPermissions = getSkipPermission();
    if (hasSkippedPermissions) {
      setHasSkippedLocation(true);
    }

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    permissionStatus,
    isLoading,
    location,
    hasSkippedLocation,
    getCurrentLocation,
    checkLocationPermission,
    requestLocationPermission,
    handleDeniedPermissionModal,
    skipLocationPermission,
    isGranted: permissionStatus === RESULTS.GRANTED,
    isDenied: permissionStatus === RESULTS.DENIED,
    isBlocked: permissionStatus === RESULTS.BLOCKED,
    isUnavailable: permissionStatus === RESULTS.UNAVAILABLE,
  };
};
