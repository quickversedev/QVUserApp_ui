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

const dummyRecommendations = [
  {
    id: '1',
    type: 'restaurant',
    name: 'Healthy Bites Cafe',
    description: 'Based on your healthy eating preferences',
    image: require('../../../../assets/images/bg_1.png'),
    tag: 'Recommended',
  },
  {
    id: '2',
    type: 'grocery',
    name: 'Organic Essentials Pack',
    description: 'Similar to your last grocery order',
    image: require('../../../../assets/images/bg_1.png'),
    tag: 'Recent',
  },
  {
    id: '3',
    type: 'pharmacy',
    name: 'Wellness Package',
    description: 'Recommended health products',
    image: require('../../../../assets/images/bg_1.png'),
    tag: 'New',
  },
  {
    id: '4',
    type: 'restaurant',
    name: 'Quick Bites Express',
    description: 'Popular in your area',
    image: require('../../../../assets/images/bg_1.png'),
    tag: 'Trending',
  },
  {
    id: '5',
    type: 'grocery',
    name: 'Fresh Fruits Bundle',
    description: 'Seasonal picks for you',
    image: require('../../../../assets/images/bg_1.png'),
    tag: 'Season Special',
  },
];

interface ForYouContentProps {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle?: number;
  contentContainerStyle?: ViewStyle;
  showsVerticalScrollIndicator?: boolean;
}

export const ForYouContent: React.FC<ForYouContentProps> = ({
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
        Recommended For You
      </ThemeText>

      {dummyRecommendations.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[styles.itemCard, { backgroundColor: theme.colors.card }]}
        >
          <Image source={item.image} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <View style={styles.headerRow}>
              <ThemeText variant="h2">{item.name}</ThemeText>
              <View style={[styles.tag, { backgroundColor: theme.colors.primary }]}>
                <ThemeText variant="small" color={theme.colors.white}>
                  {item.tag}
                </ThemeText>
              </View>
            </View>
            <ThemeText variant="body" color={theme.colors.subText}>
              {item.description}
            </ThemeText>
            <ThemeText variant="small" color={theme.colors.primary} style={styles.type}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  type: {
    marginTop: 8,
  },
});
