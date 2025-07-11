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

const dummyPharmacyItems = [
  {
    id: '1',
    name: 'First Aid Kit',
    price: '₹599',
    description: 'Complete emergency kit',
    image: require('../../../../assets/images/bg_1.png'),
  },
  {
    id: '2',
    name: 'Vitamins Bundle',
    price: '₹799',
    description: 'Essential daily vitamins',
    image: require('../../../../assets/images/bg_1.png'),
  },
  {
    id: '3',
    name: 'Personal Care Kit',
    price: '₹399',
    description: 'Basic hygiene products',
    image: require('../../../../assets/images/bg_1.png'),
  },
  {
    id: '4',
    name: 'Baby Care Package',
    price: '₹699',
    description: 'Essential baby products',
    image: require('../../../../assets/images/bg_1.png'),
  },
  {
    id: '5',
    name: 'Health Monitoring Kit',
    price: '₹1299',
    description: 'Basic health monitoring devices',
    image: require('../../../../assets/images/bg_1.png'),
  },
];

interface PharmacyContentProps {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle?: number;
  contentContainerStyle?: ViewStyle;
  showsVerticalScrollIndicator?: boolean;
}

export const PharmacyContent: React.FC<PharmacyContentProps> = ({
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
        Pharmacy
      </ThemeText>

      {dummyPharmacyItems.map(item => (
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
