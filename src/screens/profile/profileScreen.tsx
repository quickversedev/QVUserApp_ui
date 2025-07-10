import React from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/login/AuthProvider';
import { useTheme } from '../../theme/ThemeContext';

type FeatureItem = {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
};

const ProfileScreen = () => {
  const { signOut } = useAuth();
  const { getColor } = useTheme();

  const features: FeatureItem[] = [
    {
      id: 'feature1',
      title: 'Feature 01',
      icon: 'circle-outline',
      onPress: () => {},
    },
    {
      id: 'feature2',
      title: 'Feature 02',
      icon: 'circle-outline',
      onPress: () => {},
    },
    {
      id: 'feature3',
      title: 'Feature 03',
      icon: 'circle-outline',
      onPress: () => {},
    },
    {
      id: 'feature4',
      title: 'Feature 04',
      icon: 'circle-outline',
      onPress: () => {},
    },
  ];

  const FeatureButton = ({ item }: { item: FeatureItem }) => (
    <TouchableOpacity
      style={[styles.featureButton, { backgroundColor: getColor('card') }]}
      onPress={item.onPress}
    >
      <View style={styles.featureContent}>
        <Icon name={item.icon} size={24} color={getColor('text')} />
        <Text style={[styles.featureText, { color: getColor('text') }]}>{item.title}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={getColor('text')} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: getColor('background') }]}>
      <View style={styles.container}>
        {/* User Info Section with Logo */}
        <View style={styles.userSection}>
          <View style={styles.userInfoContainer}>
            <View style={[styles.avatarContainer, { backgroundColor: getColor('card') }]}>
              <Icon name="account" size={40} color={getColor('text')} />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: getColor('text') }]} numberOfLines={1}>
                Rahul Sharma
              </Text>
              <Text style={[styles.userPhone, { color: getColor('subText') }]} numberOfLines={1}>
                +91 97XXX XXXXX
              </Text>
            </View>
          </View>
          <Image
            source={require('../../assets/images/logo_qv.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Features Section */}
        <View style={[styles.featuresContainer, { backgroundColor: getColor('card') }]}>
          {features.map(item => (
            <FeatureButton key={item.id} item={item} />
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: getColor('card') }]}
          onPress={signOut}
        >
          <View style={styles.featureContent}>
            <Icon name="logout" size={24} color="#FF4444" />
            <Text style={[styles.logoutText]}>Logout</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    flexShrink: 0,
  },
  userInfo: {
    flex: 1,
    marginRight: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
  },
  logo: {
    width: 40,
    height: 40,
    flexShrink: 0,
  },
  featuresContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  featureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#FF4444',
  },
});

export default ProfileScreen;
