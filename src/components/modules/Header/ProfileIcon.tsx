import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../../routes/AppStack';
import { useTheme } from '../../../theme/ThemeContext';

export const ProfileIcon = () => {
  const { getColor } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: getColor('card'),
        },
      ]}
      onPress={handleProfilePress}
    >
      <Icon name="account" size={24} color={getColor('subText')} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
