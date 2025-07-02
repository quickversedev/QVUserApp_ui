import React, {useEffect, useRef, useContext} from 'react';
import {View, StyleSheet, TouchableOpacity, Animated, ScrollView, Text, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import {useTheme, Theme} from '../../theme/ThemeContext';
import ThemedText from '../../components/common/theme/ThemeText';
import {useAuth} from '../../contexts/login/AuthProvider';
import Registration from '../login/Registration';
import {storage} from '../../services/localStorage/storage.service';
import {TabBarVisibilityContext} from '../../navigation/TabNavigation';

const HomeScreen = () => {
  const {theme, isLoading, getButtonColor} = useTheme();
  const {isNewUser} = useAuth();
  const modalAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const tabBarTranslateY = useContext(TabBarVisibilityContext);
  const lastOffset = useRef(0);
 
  if (isNewUser) {
    return <Registration />;
  }
  if (isLoading) {
    return (
      <View style={getStyles(theme).container}>
        <ThemedText type="h2">Loading theme...</ThemedText>
      </View>
    );
  }
  storage.set('alreadyLaunched', true);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!tabBarTranslateY) return;
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > lastOffset.current ? 'down' : 'up';
    if (direction === 'down' && currentOffset > 30) {
      Animated.timing(tabBarTranslateY, {
        toValue: 100,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else if (direction === 'up') {
      Animated.timing(tabBarTranslateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
    lastOffset.current = currentOffset;
  };

  return (
    <View style={getStyles(theme).container}>
      <ThemedText type="h1" color="primary">
        H1 - Welcome to Our App
      </ThemedText>
      <ThemedText type="h2" style={getStyles(theme).subtitle}>
        H2 - Experience the perfect theme configuration
      </ThemedText>
      <ThemedText type="subtitle" style={getStyles(theme).subtitle}>
        subtitle - Experience the perfect theme configuration
      </ThemedText>
      <ThemedText type="body" style={getStyles(theme).subtitle}>
        Body - Experience the perfect theme configuration
      </ThemedText>
      <ThemedText type="caption" style={getStyles(theme).subtitle}>
        caption - Experience the perfect theme configuration
      </ThemedText>

      <TouchableOpacity
        style={[
          getStyles(theme).button,
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
      <ScrollView
        style={getStyles(theme).scrollView}
        contentContainerStyle={getStyles(theme).scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {[...Array(20)].map((_, i) => (
          <View key={i} style={getStyles(theme).card}>
            <Text style={getStyles(theme).cardText}>Scrollable Item {i + 1}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  subtitle: {
    marginVertical: 20,
  },
  button: {
    padding: 15,
    borderRadius: theme.borderRadius.full,
    marginTop: 30,
  },
  scrollView: {
    marginTop: 30,
    width: '100%',
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 100,
    alignItems: 'center',
  },
  card: {
    width: '95%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: 20,
    marginBottom: 16,
    shadowColor: theme.colors.shadow.color,
    shadowOffset: theme.colors.shadow.offset,
    shadowOpacity: theme.colors.shadow.opacity,
    shadowRadius: theme.colors.shadow.radius,
    elevation: 2,
  },
  cardText: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: '500',
  },
});

export default HomeScreen;
