import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeText } from '../../../../components/common/theme/ThemeText';
import { useTheme } from '../../../../theme/ThemeContext';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;

const dummyRestaurants = [
  {
    id: '1',
    name: 'Tasty Bites',
    rating: '4.5',
    deliveryTime: '25-30 min',
    cuisine: 'Indian, Chinese',
    image: require('../../../../assets/images/bg_1.png'),
    priceRange: '₹200 for two',
  },
  {
    id: '2',
    name: 'Pizza Paradise',
    rating: '4.2',
    deliveryTime: '35-40 min',
    cuisine: 'Italian, Fast Food',
    image: require('../../../../assets/images/bg_1.png'),
    priceRange: '₹300 for two',
  },
  {
    id: '3',
    name: 'Burger Bliss',
    rating: '4.0',
    deliveryTime: '20-25 min',
    cuisine: 'American, Fast Food',
    image: require('../../../../assets/images/bg_1.png'),
    priceRange: '₹150 for two',
  },
];

const dummyCategories = [
  { id: '1', name: 'Offers', icon: '🎉' },
  { id: '2', name: 'Indian', icon: '🍛' },
  { id: '3', name: 'Pizza', icon: '🍕' },
  { id: '4', name: 'Burger', icon: '🍔' },
  { id: '5', name: 'Chinese', icon: '🥢' },
  { id: '6', name: 'Desserts', icon: '🍰' },
  { id: '7', name: 'Beverages', icon: '🥤' },
];

export const HomeContent = () => {
  const { theme } = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemeText variant="h2" style={styles.sectionTitle}>
        Categories
      </ThemeText>
      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesRow}>
          {dummyCategories.map(category => (
            <TouchableOpacity key={category.id} style={styles.categoryItem}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <ThemeText variant="small">{category.name}</ThemeText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ThemeText variant="h2" style={styles.sectionTitle}>
        Popular Restaurants
      </ThemeText>
      {dummyRestaurants.map(restaurant => (
        <TouchableOpacity key={restaurant.id} style={styles.restaurantCard}>
          <Image source={restaurant.image} style={styles.restaurantImage} />
          <View style={styles.restaurantInfo}>
            <ThemeText variant="h2">{restaurant.name}</ThemeText>
            <View style={styles.restaurantDetails}>
              <View style={styles.rating}>
                <ThemeText variant="small" color={theme.colors.black}>
                  ★ {restaurant.rating}
                </ThemeText>
              </View>
              <ThemeText variant="small" color={theme.colors.subText}>
                {restaurant.deliveryTime}
              </ThemeText>
            </View>
            <ThemeText variant="small" color={theme.colors.subText}>
              {restaurant.cuisine}
            </ThemeText>
            <ThemeText variant="small" color={theme.colors.subText}>
              {restaurant.priceRange}
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
  categoriesContainer: {
    paddingHorizontal: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  restaurantCard: {
    width: cardWidth,
    backgroundColor: 'white',
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
  restaurantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
