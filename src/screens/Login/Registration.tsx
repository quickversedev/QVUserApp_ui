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
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useAuth} from '../../contexts/login/AuthProvider';
import {LoginStackParamList} from '../../navigation/LoginNavigation';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../theme/ThemeContext';

const {height} = Dimensions.get('window');
type LoginScreenNavigationProp = StackNavigationProp<
  LoginStackParamList,
  'LoginScreen'
>;

const Registration: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    gender: '',
    dateOfBirth: '',
  });

  const auth = useAuth();
  const {theme} = useTheme();

  const handleSkipLogin = () => {
    auth.setSkipLogin(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;

    // Hide the picker on Android after selection
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'set' || event.type === 'dismissed') {
      setDateOfBirth(currentDate);
      setErrors(prev => ({...prev, dateOfBirth: ''}));
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const validateFields = () => {
    let valid = true;
    const newErrors = {
      fullName: '',
      email: '',
      gender: '',
      dateOfBirth: '',
    };

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    } else if (fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);
    if (fullName && email && dateOfBirth) {
      try {
        auth.signUp(fullName, 'IIMU', email, dateOfBirth.toDateString());

        // Alert.alert('Success', 'Registration successful');
      } catch (error) {
        console.log('registration failure');
      } finally {
        setLoading(false);
      }
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const validateDate = (date: Date) => {
    const age = calculateAge(date);
    if (age < 13) {
      return 'You must be at least 13 years old';
    }
    if (age > 120) {
      return 'Please enter a valid date of birth';
    }
    return '';
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    topBackground: {
      height: height * 0.55,
      width: '100%',
      position: 'absolute',
      top: Platform.OS === 'ios' ? 60 : 80,
    },
    logoContainer: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 60 : 80,
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
      minHeight: height * 0.6,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      padding: 24,
      marginTop: height * 0.24,
      shadowColor: theme.colors.shadow.color,
      shadowOffset: theme.colors.shadow.offset,
      shadowOpacity: theme.colors.shadow.opacity,
      shadowRadius: theme.colors.shadow.radius,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.colors.borderHighlight,
      marginBottom: 20,
    },
    title: {
      fontSize: theme.typography.h2,
      color: theme.colors.text,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    subtitle: {
      textAlign: 'center',
      color: theme.colors.subText,
      marginTop: 5,
      marginBottom: 20,
    },
    skipContainer: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: theme.colors.overlay,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: theme.borderRadius.full,
      elevation: 2,
    },
    label: {
      color: theme.colors.subText,
      fontSize: theme.typography.caption,
      marginTop: 16,
      marginBottom: 6,
    },
    inputField: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: 12,
      paddingVertical: 12,
      color: theme.colors.text,
      fontSize: theme.typography.body,
      marginBottom: 8,
    },
    errorInput: {
      borderColor: theme.colors.error || '#EF4444',
    },
    errorText: {
      color: theme.colors.error || '#EF4444',
      fontSize: theme.typography.small,
      marginBottom: 12,
    },
    genderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    genderOption: {
      flex: 1,
      marginHorizontal: 4,
      paddingVertical: 10,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    genderOptionSelected: {
      backgroundColor: theme.colors.secondary,
      borderColor: theme.colors.secondary,
    },
    genderText: {
      color: theme.colors.text,
    },
    genderTextSelected: {
      color: theme.colors.background,
      fontWeight: 'bold',
    },
    registerButton: {
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.borderRadius.sm,
      paddingVertical: 14,
      marginTop: 16,
    },
    registerButtonText: {
      fontSize: theme.typography.body,
      color: theme.colors.background,
      textAlign: 'center',
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled">
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
                <Text style={styles.title}>Register</Text>
                <Text style={styles.subtitle}>
                  Create your Quickverse account
                </Text>

                <TouchableOpacity
                  style={styles.skipContainer}
                  onPress={handleSkipLogin}>
                  <Text style={{color: '#E5E7EB', fontSize: 14}}>Skip</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  value={fullName}
                  onChangeText={text => {
                    setFullName(text);
                    setErrors(prev => ({...prev, fullName: ''}));
                  }}
                  placeholder="Enter your full name"
                  style={[
                    styles.inputField,
                    errors.fullName && styles.errorInput,
                  ]}
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="next"
                />
                {errors.fullName ? (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                ) : null}

                <Text style={styles.label}>Email *</Text>
                <TextInput
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    setErrors(prev => ({...prev, email: ''}));
                  }}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  style={[styles.inputField, errors.email && styles.errorInput]}
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="next"
                  autoCapitalize="none"
                />
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}

                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                  {['Male', 'Female', 'Other'].map(option => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.genderOption,
                        gender === option && styles.genderOptionSelected,
                      ]}
                      onPress={() => {
                        setGender(option);
                        setErrors(prev => ({...prev, gender: ''}));
                      }}>
                      <Text
                        style={[
                          styles.genderText,
                          gender === option && styles.genderTextSelected,
                        ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity
                  style={styles.inputField}
                  onPress={() => setShowDatePicker(true)}>
                  <Text style={{color: dateOfBirth ? '#F3F4F6' : '#9CA3AF'}}>
                    {dateOfBirth
                      ? formatDate(dateOfBirth)
                      : 'Select your date of birth'}
                  </Text>
                </TouchableOpacity>
                {errors.dateOfBirth ? (
                  <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                ) : null}

                {showDatePicker && (
                  <DateTimePicker
                    value={dateOfBirth || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}

                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={handleRegister}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.registerButtonText}>Register</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Registration;
