import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Image,
  Platform,
  SafeAreaView,
} from 'react-native';

import {useAuth} from '../../contexts/login/AuthProvider';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';
import {LoginStackParamList} from '../../navigation/LoginNavigation';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

const {height} = Dimensions.get('window');
type LoginScreenNavigationProp = StackNavigationProp<
  LoginStackParamList,
  'LoginScreen'
>;
const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [countryCode, setCountryCode] = useState<CountryCode>('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };
  const auth = useAuth();

  const handleSkipLogin = () => {
    auth.setSkipLogin(true);
  };
  const handleLogin = async () => {
    console.log('Login button pressed');
    setLoading(true);
    try {
      await auth.sendOtp(phoneNumber);
      console.log('success');
    } catch (err) {
      console.log('Error:', err);
      Alert.alert('Error', 'Login failed');
    } finally {
      console.log('finally');
      setLoading(false);
    }

    navigation.navigate({
      name: 'OTPScreen',
      params: {phoneNumber, verificationId: 'abc'},
    });
    // Add login logic here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/images/bg_1.png')}
          style={styles.topBackground}
          resizeMode="cover"
        />
        <View style={styles.logoContainer}>
          <Image
            style={styles.topLogo}
            source={require('../../assets/images/logo_qv.png')}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Log In to your Quickverse account</Text>

          <TouchableOpacity
            style={styles.skipContainer}
            onPress={handleSkipLogin}>
            <Text style={{color: '#E5E7EB', fontSize: 14}}>Skip</Text>
          </TouchableOpacity>
          <Text style={{color: '#9CA3AF', marginTop: 36, marginBottom: 10}}>
            Phone number
          </Text>
          <View style={styles.phoneInputWrapper}>
            <CountryPicker
              withCallingCode
              withFilter
              countryCode={countryCode}
              withFlag
              withEmoji
              onSelect={onSelect}
              containerButtonStyle={styles.countryPicker}
            />
            <Text style={styles.callingCode}>+{callingCode}</Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter phone number"
              keyboardType="number-pad"
              maxLength={10}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity
            style={styles.otpButton}
            onPress={handleLogin}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.otpText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  topBackground: {
    height: height * 0.55,
    width: '100%',
    position: 'absolute',
    top: Platform.OS === 'ios' ? -50 : -80,
  },
  logoContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 80 : 110,
    alignItems: 'center',
    width: '100%',
  },
  topLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  card: {
    width: '90%',
    height: '40%',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    // paddingBottom: 32,
    marginTop: height * 0.28,
    shadowColor: '#FAE588',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'yellow',
  },
  title: {
    fontSize: 22,
    color: '#F3F4F6',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 5,
    marginBottom: 20,
  },
  skipContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4B5563',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 2,
  },
  skipText: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  phoneLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 36,
    marginBottom: 6,
  },
  phoneInputWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderColor: '#374151',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  countryPicker: {
    marginRight: 6,
  },
  callingCode: {
    color: 'white',
    fontSize: 16,
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
  },
  otpButton: {
    backgroundColor: '#FFE885',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 'auto',
  },
  otpText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
