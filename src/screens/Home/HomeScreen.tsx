import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';
import ThemedText from '../../components/common/ThemeText';
import {storage} from '../../services/localStorage/storage.service';

const HomeScreen = () => {
  const {theme, isLoading, getButtonColor} = useTheme();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ThemedText type="h2">Loading theme...</ThemedText>
      </View>
    );
  }
  storage.set('alreadyLaunched', true);
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.warning}]}>
      <ThemedText type="h1" color="primary">
        H1 - Welcome to Our App
      </ThemedText>
      <ThemedText type="h2" style={styles.subtitle}>
        H2 - Experience the perfect theme configuration
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        subtitle - Experience the perfect theme configuration
      </ThemedText>
      <ThemedText type="body" style={styles.subtitle}>
        Body - Experience the perfect theme configuration
      </ThemedText>
      <ThemedText type="caption" style={styles.subtitle}>
        caption - Experience the perfect theme configuration
      </ThemedText>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: getButtonColor('pressed', 'background'),
            opacity: 1,
          },
        ]}>
        <ThemedText
          type="h2"
          style={{
            color: getButtonColor('disabled', 'text'),
            fontWeight: '500',
          }}>
          hello
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    marginVertical: 20,
  },
  button: {
    padding: 15,
    borderRadius: 28,
    marginTop: 30,
  },
});

export default HomeScreen;
