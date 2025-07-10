import notifee, {
  AndroidImportance,
  AndroidVisibility,
  Event,
  EventType,
} from '@notifee/react-native';
import {
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
} from '@react-native-firebase/messaging';
import { useCallback, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

interface NotificationPayload {
  title?: string;
  body?: string;
  data?: { [key: string]: string | object };
}

export const useNotifications = () => {
  const createDefaultChannel = async () => {
    // Create a channel (required for Android)
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    });
  };

  const displayNotification = async (payload: NotificationPayload) => {
    // Create a channel if it doesn't exist (Android requirement)
    if (Platform.OS === 'android') {
      await createDefaultChannel();
    }

    // Display the notification
    await notifee.displayNotification({
      title: payload.title,
      body: payload.body,
      data: payload.data,
      android: {
        channelId: 'default',
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      const settings = await notifee.requestPermission();
      return settings.authorizationStatus;
    }

    if (Platform.OS === 'android') {
      // Request notification permission
      const hasPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return hasPermission;
    }
  };

  const setupForegroundHandler = () => {
    return onMessage(
      getMessaging(),
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        // Display notification using Notifee
        await displayNotification({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          data: remoteMessage.data,
        });
      }
    );
  };

  const setupBackgroundHandler = () => {
    // When the app is in the background or terminated
    const messaging = getMessaging();
    messaging.setBackgroundMessageHandler(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        // We don't need to display the notification here as Android automatically
        // creates the notification for background messages.
        // For iOS, we'll handle it through Notifee's background event handler
        if (Platform.OS === 'ios') {
          await displayNotification({
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            data: remoteMessage.data,
          });
        }
      }
    );
  };

  const setupNotificationOpenedHandler = useCallback(() => {
    // When the app is in background and opened by notification
    return onNotificationOpenedApp(getMessaging(), _remoteMessage => {
      // You can implement navigation logic here based on the notification data
    });
  }, []);

  const setupInitialNotification = useCallback(async () => {
    // Check if app was opened from a notification when in quit state
    const initialNotification = await getInitialNotification(getMessaging());
    if (initialNotification) {
      // You can implement navigation logic here based on the notification data
    }
  }, []);

  const setupNotifeeBackgroundHandler = () => {
    // Return a no-op cleanup function since Notifee background handlers can't be unsubscribed
    notifee.onBackgroundEvent(async ({ type }: Event) => {
      if (type === EventType.PRESS) {
        // Handle notification press - you can implement your navigation logic here
        // or dispatch an action to your state management system
      }
    });
    return () => {};
  };

  const getFCMToken = async () => {
    try {
      const messaging = getMessaging();
      const token = await getToken(messaging);
      return token;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    let unsubscribeForeground: (() => void) | undefined;
    let unsubscribeBackground: (() => void) | undefined;
    let unsubscribeOpened: (() => void) | undefined;

    const setupNotifications = async () => {
      const permissionStatus = await requestPermissions();

      if (permissionStatus) {
        // Get the FCM token
        await getFCMToken();

        // Setup handlers
        unsubscribeForeground = setupForegroundHandler();
        unsubscribeBackground = setupNotifeeBackgroundHandler();
        unsubscribeOpened = setupNotificationOpenedHandler();
        setupBackgroundHandler(); // No cleanup needed for background handler
        await setupInitialNotification();
      }
    };

    setupNotifications();

    // Cleanup
    return () => {
      unsubscribeForeground?.();
      unsubscribeBackground?.();
      unsubscribeOpened?.();
    };
  }, [setupInitialNotification, setupNotificationOpenedHandler]);

  return {
    displayNotification,
    getFCMToken,
    requestPermissions,
  };
};
