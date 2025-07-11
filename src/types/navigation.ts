import { NavigationProp } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/HomeNavigation';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

export type AppNavigationProp = NavigationProp<RootStackParamList>;

export type { HomeStackParamList };

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList, HomeStackParamList {}
  }
}
