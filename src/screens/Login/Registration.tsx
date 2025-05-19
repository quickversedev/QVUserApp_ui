// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Dimensions,
//   ImageBackground,
//   Image,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   KeyboardAvoidingView,
//   Keyboard,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import {useAuth} from '../../contexts/login/AuthProvider';
// import {LoginStackParamList} from '../../navigation/LoginNavigation';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {useNavigation} from '@react-navigation/native';

// const {height} = Dimensions.get('window');
// type LoginScreenNavigationProp = StackNavigationProp<
//   LoginStackParamList,
//   'LoginScreen'
// >;

// const Registration: React.FC = () => {
//   const navigation = useNavigation<LoginScreenNavigationProp>();
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [gender, setGender] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const auth = useAuth();

//   const handleSkipLogin = () => {
//     auth.setSkipLogin(true);
//   };

//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     const currentDate = selectedDate || dateOfBirth;
//     setShowDatePicker(Platform.OS === 'ios');
//     setDateOfBirth(currentDate);
//   };

//   const formatDate = (date: Date) => {
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     });
//   };

//   const handleRegister = () => {
//     if (!fullName || !email) {
//       Alert.alert('Error', 'Please fill in all required fields');
//       return;
//     }
//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setLoading(false);
//       const userInfo = {
//         fullName,
//         email,
//         gender,
//         dateOfBirth,
//       };

//       Alert.alert('Success', 'Registration successful');
//     }, 1500);
//   };

//   const dismissKeyboard = () => {
//     Keyboard.dismiss();
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         style={styles.keyboardAvoidingView}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//         <TouchableWithoutFeedback onPress={dismissKeyboard}>
//           <ScrollView
//             contentContainerStyle={styles.scrollContainer}
//             keyboardShouldPersistTaps="handled">
//             <View style={styles.container}>
//               <ImageBackground
//                 source={require('../../assets/images/bg_1.png')}
//                 style={styles.topBackground}
//                 resizeMode="cover"
//               />
//               <View style={styles.logoContainer}>
//                 <Image
//                   style={styles.topLogo}
//                   source={require('../../assets/images/logo_qv.png')}
//                 />
//               </View>

//               <View style={styles.card}>
//                 <Text style={styles.title}>Register</Text>
//                 <Text style={styles.subtitle}>
//                   Create your Quickverse account
//                 </Text>

//                 <TouchableOpacity
//                   style={styles.skipContainer}
//                   onPress={handleSkipLogin}>
//                   <Text style={{color: '#E5E7EB', fontSize: 14}}>Skip</Text>
//                 </TouchableOpacity>

//                 <Text style={styles.label}>Full Name *</Text>
//                 <TextInput
//                   value={fullName}
//                   onChangeText={setFullName}
//                   placeholder="Enter your full name"
//                   style={styles.inputField}
//                   placeholderTextColor="#9CA3AF"
//                   returnKeyType="next"
//                   onSubmitEditing={() => {
//                     // You can add focus to next field here if needed
//                   }}
//                 />

//                 <Text style={styles.label}>Email *</Text>
//                 <TextInput
//                   value={email}
//                   onChangeText={setEmail}
//                   placeholder="Enter your email"
//                   keyboardType="email-address"
//                   style={styles.inputField}
//                   placeholderTextColor="#9CA3AF"
//                   returnKeyType="next"
//                   onSubmitEditing={() => {
//                     Keyboard.dismiss();
//                   }}
//                 />

//                 <Text style={styles.label}>Gender</Text>
//                 <View style={styles.genderContainer}>
//                   {['Male', 'Female', 'Other'].map(option => (
//                     <TouchableOpacity
//                       key={option}
//                       style={[
//                         styles.genderOption,
//                         gender === option && styles.genderOptionSelected,
//                       ]}
//                       onPress={() => setGender(option)}>
//                       <Text
//                         style={[
//                           styles.genderText,
//                           gender === option && styles.genderTextSelected,
//                         ]}>
//                         {option}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>

//                 <Text style={styles.label}>Date of Birth</Text>
//                 <TouchableOpacity
//                   style={styles.inputField}
//                   onPress={() => setShowDatePicker(true)}>
//                   <Text style={{color: dateOfBirth ? '#F3F4F6' : '#9CA3AF'}}>
//                     {dateOfBirth
//                       ? formatDate(dateOfBirth)
//                       : 'Select your date of birth'}
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.registerButton}
//                   onPress={handleRegister}
//                   disabled={loading}>
//                   {loading ? (
//                     <ActivityIndicator color="#fff" />
//                   ) : (
//                     <Text style={styles.registerButtonText}>Register</Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </ScrollView>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#111827',
//   },
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingBottom: 20, // Add some padding at the bottom for keyboard
//   },
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     backgroundColor: '#111827',
//   },
//   topBackground: {
//     height: height * 0.55,
//     width: '100%',
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? -50 : -80,
//   },
//   logoContainer: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 60 : 80,
//     alignItems: 'center',
//     width: '100%',
//   },
//   topLogo: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//   },
//   card: {
//     width: '90%',
//     minHeight: height * 0.6,
//     backgroundColor: '#1F2937',
//     borderRadius: 16,
//     padding: 24,
//     marginTop: height * 0.28,
//     shadowColor: '#FAE588',
//     shadowOffset: {width: 0, height: 5},
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     elevation: 6,
//     borderWidth: 1,
//     borderColor: 'yellow',
//     marginBottom: 20, // Extra margin at bottom for keyboard
//   },
//   title: {
//     fontSize: 22,
//     color: '#F3F4F6',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   subtitle: {
//     textAlign: 'center',
//     color: '#9CA3AF',
//     marginTop: 5,
//     marginBottom: 20,
//   },
//   skipContainer: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     backgroundColor: '#4B5563',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     elevation: 2,
//   },
//   label: {
//     color: '#9CA3AF',
//     fontSize: 14,
//     marginTop: 16,
//     marginBottom: 6,
//   },
//   inputField: {
//     backgroundColor: '#1F2937',
//     borderColor: '#374151',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     color: '#F3F4F6',
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   genderContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   genderOption: {
//     flex: 1,
//     marginHorizontal: 4,
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#374151',
//     alignItems: 'center',
//   },
//   genderOptionSelected: {
//     backgroundColor: '#FFE885',
//     borderColor: '#FFE885',
//   },
//   genderText: {
//     color: '#F3F4F6',
//   },
//   genderTextSelected: {
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   registerButton: {
//     backgroundColor: '#FFE885',
//     borderRadius: 8,
//     paddingVertical: 14,
//     marginTop: 16,
//   },
//   registerButtonText: {
//     fontSize: 16,
//     color: '#000',
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
// });

// export default Registration;
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
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    gender: '',
    dateOfBirth: '',
  });

  const auth = useAuth();

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
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      const userInfo = {
        fullName,
        email,
        gender,
        dateOfBirth,
      };
      console.log('userInfo', userInfo);
      Alert.alert('Success', 'Registration successful');
    }, 1500);
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

                {/* <Text style={styles.label}>Date of Birth</Text>
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
                    textColor="#FFFFFF"
                  />
                )} */}

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
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
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    marginTop: height * 0.28,
    shadowColor: '#FAE588',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'yellow',
    marginBottom: 20,
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
  label: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 16,
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#F3F4F6',
    fontSize: 16,
    marginBottom: 8,
  },
  errorInput: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: '#FFE885',
    borderColor: '#FFE885',
  },
  genderText: {
    color: '#F3F4F6',
  },
  genderTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#FFE885',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 16,
  },
  registerButtonText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Registration;
