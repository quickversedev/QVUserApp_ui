import React from 'react';
import { StyleSheet, View } from 'react-native';
import ThemeText from '../../components/common/theme/ThemeText';

const DummyScreen3 = () => {
  return (
    <View style={styles.container}>
      <ThemeText>Dummy Screen 3</ThemeText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DummyScreen3;
