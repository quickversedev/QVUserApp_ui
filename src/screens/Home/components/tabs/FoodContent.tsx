import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemeText } from '../../../../components/common/theme/ThemeText';
import { useTheme } from '../../../../theme/ThemeContext';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;

const dummyRestaurants = [
  {
    id: '1',
    name: 'Tasty Bites',
    cuisine: 'Indian, Chinese',
    image: require('../../../../assets/images/bg_1.png'),
  },
  {
    id: '2',
    name: 'Pizza Paradise',
    cuisine: 'Italian, Fast Food',
    image: require('../../../../assets/images/bg_1.png'),
  },
  {
    id: '3',
    name: 'Burger Bliss',
    cuisine: 'American, Fast Food',
    image: require('../../../../assets/images/bg_1.png'),
  },
];

export const FoodContent = () => {
  const { theme } = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemeText variant="h2" style={styles.sectionTitle}>
        Food Delivery
      </ThemeText>
      {dummyRestaurants.map(restaurant => (
        <TouchableOpacity
          key={restaurant.id}
          style={[styles.restaurantCard, { backgroundColor: theme.colors.card }]}
        >
          <Image source={restaurant.image} style={styles.restaurantImage} />
          <View style={styles.restaurantInfo}>
            <ThemeText variant="h2">{restaurant.name}</ThemeText>
            <ThemeText variant="small" color={theme.colors.subText}>
              {restaurant.cuisine}
            </ThemeText>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  restaurantCard: {
    width: cardWidth,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  restaurantImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  restaurantInfo: {
    padding: 12,
  },
});
