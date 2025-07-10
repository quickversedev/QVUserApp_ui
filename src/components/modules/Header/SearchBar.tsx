import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../theme/ThemeContext';

export const SearchBar = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.primary,
            shadowColor: theme.colors.primary,
          },
        ]}
      >
        <Icon name="magnify" size={22} color={theme.colors.subText} style={styles.icon} />
        <TextInput
          placeholder="Search for 'Shwarma'"
          placeholderTextColor={theme.colors.subText}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              fontSize: theme.typography.body,
              lineHeight: theme.typography.body * theme.typography.lineHeightMultiplier,
              fontFamily: theme.typography.fontFamily,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderBottomWidth: 2,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    padding: 0,
  },
});
