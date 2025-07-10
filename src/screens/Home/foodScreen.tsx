import React from 'react';
import { StyleSheet, View } from 'react-native';
import ThemeText from '../../components/common/theme/ThemeText';

const FoodScreen = () => {
  return (
    <View style={styles.container}>
      <ThemeText style={styles.text}>Food Screen</ThemeText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default FoodScreen;
