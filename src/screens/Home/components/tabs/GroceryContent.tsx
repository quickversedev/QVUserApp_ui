import React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ThemeText } from '../../../../components/common/theme/ThemeText';
import { useTheme } from '../../../../theme/ThemeContext';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;

const dummyGroceryItems = [
  {
    id: '1',
    name: 'Fresh Vegetables Pack',
    price: '₹199',
    description: 'Assorted fresh vegetables',
    image: require('../../../../assets/images/bg_1.png'),
  },
  {
    id: '2',
    name: 'Organic Fruits Bundle',
    price: '₹299',
    description: 'Selection of organic fruits',
    image: require('../../../../assets/images/bg_1.png'),
  },
  {
    id: '3',
    name: 'Daily Essentials Kit',
    price: '₹499',
    description: 'Basic household items',
    image: require('../../../../assets/images/bg_1.png'),
  },
  {
    id: '4',
    name: 'Breakfast Bundle',
    price: '₹399',
    description: 'Complete breakfast items',
    image: require('../../../../assets/images/bg_1.png'),
  },
  {
    id: '5',
    name: 'Snacks Package',
    price: '₹299',
    description: 'Assorted healthy snacks',
    image: require('../../../../assets/images/bg_1.png'),
  },
];

interface GroceryContentProps {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle?: number;
  contentContainerStyle?: ViewStyle;
  showsVerticalScrollIndicator?: boolean;
}

export const GroceryContent: React.FC<GroceryContentProps> = ({
  onScroll,
  scrollEventThrottle,
  contentContainerStyle,
  showsVerticalScrollIndicator,
}) => {
  const { theme } = useTheme();

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    >
      <ThemeText variant="h2" style={styles.sectionTitle}>
        Grocery Delivery
      </ThemeText>

      {dummyGroceryItems.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[styles.itemCard, { backgroundColor: theme.colors.card }]}
        >
          <Image source={item.image} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <ThemeText variant="h2">{item.name}</ThemeText>
            <ThemeText variant="body" color={theme.colors.subText}>
              {item.description}
            </ThemeText>
            <ThemeText variant="subtitle" style={styles.price}>
              {item.price}
            </ThemeText>
          </View>
        </TouchableOpacity>
      ))}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  itemCard: {
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
  itemImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  itemInfo: {
    padding: 12,
  },
  price: {
    marginTop: 8,
  },
});
