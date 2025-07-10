import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import ThemeText from '../../components/common/theme/ThemeText';
import { useTheme } from '../../theme/ThemeContext';

export const ForYouScreen = () => {
  const { getColor } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: getColor('background') }]}>
      <View style={[styles.container, { backgroundColor: getColor('background') }]}>
        <ThemeText style={styles.text}>For You Screen</ThemeText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
});
