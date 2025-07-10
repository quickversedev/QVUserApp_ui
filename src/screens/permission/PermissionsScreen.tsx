import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocationPermission } from '../../hooks/Permissions/usePermissions';
import { useTheme } from '../../theme/ThemeContext';

const { height } = Dimensions.get('window');

interface PermissionsScreenProps {
  onPermissionsComplete: () => void;
}

const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ onPermissionsComplete }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    topBackground: {
      height: height * 0.55,
      width: '100%',
      position: 'absolute',
      top: Platform.OS === 'ios' ? -50 : -80,
    },
    logoContainer: {
      position: 'absolute',
      top: 60,
      alignItems: 'center',
      width: '100%',
      zIndex: 2,
    },
    topLogo: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
    },
    card: {
      width: '90%',
      minHeight: '45%',
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      padding: 24,
      marginTop: height * 0.24,
      shadowColor: theme.colors.shadow.color,
      shadowOffset: theme.colors.shadow.offset,
      shadowOpacity: theme.colors.shadow.opacity,
      shadowRadius: theme.colors.shadow.radius,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.colors.borderHighlight,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: theme.typography.h2,
      color: theme.colors.text,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 16,
    },
    subtitle: {
      textAlign: 'center',
      color: theme.colors.subText,
      fontSize: theme.typography.body,
      marginBottom: 24,
      marginTop: 5,
    },
    permissionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#232B38',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      width: '100%',
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#232B38',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    icon: {
      fontSize: 22,
      color: theme.colors.secondary,
    },
    permissionTextContainer: {
      flex: 1,
    },
    permissionTitle: {
      color: theme.colors.text,
      fontWeight: 'bold',
      fontSize: theme.typography.subtitle,
    },
    permissionDesc: {
      color: theme.colors.subText,
      fontSize: theme.typography.caption,
      marginTop: 2,
    },
    permissionButton: {
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: 14,
      width: '100%',
      marginTop: 16,
      marginBottom: 4,
      shadowColor: theme.colors.shadow.color,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    permissionButtonText: {
      fontSize: theme.typography.body,
      color: theme.colors.background,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    skipContainer: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: theme.colors.overlay,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: theme.borderRadius.full,
      elevation: 2,
    },
  });

  const {
    isLoading,
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

  useEffect(() => {
    if (isGranted || hasSkippedLocation) {
      onPermissionsComplete();
    }
  }, [isGranted, hasSkippedLocation, onPermissionsComplete]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
        <Text style={[styles.subtitle, { marginTop: 16 }]}>Checking permissions...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ImageBackground
          source={require('../../assets/images/bg_1.png')}
          style={styles.topBackground}
          resizeMode="cover"
        />
        <View style={styles.logoContainer}>
          <Image style={styles.topLogo} source={require('../../assets/images/logo_qv.png')} />
        </View>
        <View style={styles.card}>
          <TouchableOpacity style={styles.skipContainer} onPress={skipLocationPermission}>
            <Text style={{ color: '#E5E7EB', fontSize: 14 }}>Skip</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Allow Permissions</Text>
          <Text style={styles.subtitle}>We need access to give you the{'\n'}best experience.</Text>
          <View style={styles.permissionCard}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🔔</Text>
            </View>
            <View style={styles.permissionTextContainer}>
              <Text style={styles.permissionTitle}>Enable Notifications</Text>
              <Text style={styles.permissionDesc}>Don't miss deals and delivery alerts.</Text>
            </View>
          </View>
          <View style={styles.permissionCard}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📍</Text>
            </View>
            <View style={styles.permissionTextContainer}>
              <Text style={styles.permissionTitle}>Allow Location Access</Text>
              <Text style={styles.permissionDesc}>Serve you better, wherever you are.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.permissionButton} onPress={requestLocationPermission}>
            <Text style={styles.permissionButtonText}>Allow Permissions</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PermissionsScreen;
