import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../theme/ThemeContext';
import { ThemeText } from '../../common/theme/ThemeText';

export const LocationSelector = () => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity style={styles.container}>
      <Icon name="map-marker" size={24} color={theme.colors.primary} style={styles.icon} />
      <View style={styles.textContainer}>
        <ThemeText variant="body" style={styles.greeting}>
          Hey, Rahul
        </ThemeText>
        <View style={styles.addressRow}>
          <ThemeText variant="caption" color={theme.colors.subText} style={styles.address}>
            PCCOE - 411044
          </ThemeText>
          <Icon name="chevron-down" size={20} color={theme.colors.subText} style={styles.chevron} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  textContainer: {
    flexDirection: 'column',
  },
  greeting: {
    fontWeight: '500',
    marginBottom: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    marginRight: 4,
  },
  chevron: {
    marginTop: 2,
  },
});
