import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {LoginStackParamList} from '../../navigation/LoginNavigation';
import {useAuth} from '../../contexts/login/AuthProvider';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../../theme/ThemeContext';

const {height} = Dimensions.get('window');

const CELL_COUNT = 4;
type LoginScreenRouteProp = RouteProp<LoginStackParamList, 'OTPScreen'>;
type OTPScreenNavigationProp = StackNavigationProp<
  LoginStackParamList,
  'OTPScreen'
>;
const OTPScreen: React.FC = () => {
  const route = useRoute<LoginScreenRouteProp>();
  const {phoneNumber, verificationId} = route.params;
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Resend OTP Timer
  const [resendTimeout, setResendTimeout] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [currentVerificationId, setCurrentVerificationId] =
    useState(verificationId);

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const auth = useAuth();
  const {theme} = useTheme();

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
      top: Platform.OS === 'ios' ? -50 : -80,
    },
    logoContainer: {
      position: 'absolute',
      top: 60,
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
      minHeight: '45%',
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
      justifyContent: 'space-between',
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
      marginBottom: 16,
    },
    skipContainer: {
      position: 'absolute',
      top: 8,
      right: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.overlay,
      alignSelf: 'flex-end',
      marginRight: 16,
      marginTop: 16,
      shadowColor: theme.colors.shadow.color,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    otpButton: {
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.borderRadius.sm,
      paddingVertical: 14,
    },
    otpText: {
      fontSize: theme.typography.body,
      color: theme.colors.background,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    subTitle_2: {
      color: theme.colors.subText,
      textAlign: 'center',
      marginTop: 12,
    },
    link: {
      color: theme.colors.primary,
    },
    changeNumber: {
      fontSize: theme.typography.body,
      color: theme.colors.primary,
      textAlign: 'center',
      marginTop: 'auto',
    },
    codeFieldRoot: {
      marginTop: '12%',
      marginBottom: '5%',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    cell: {
      width: 50,
      height: 50,
      lineHeight: 48,
      fontSize: theme.typography.h2,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cellText: {
      fontSize: theme.typography.h2,
      color: theme.colors.text,
    },
    focusCell: {
      borderColor: theme.colors.primary,
    },
    disabledLink: {
      color: theme.colors.subText,
    },
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!canResend && resendTimeout > 0) {
      interval = setInterval(() => {
        setResendTimeout(prev => prev - 1);
      }, 1000);
    } else if (resendTimeout === 0) {
      setCanResend(true);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [canResend, resendTimeout]);

  const verifyOTP = async () => {
    if (value.length !== CELL_COUNT) {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await auth.verifyOtp(phoneNumber, value, currentVerificationId);

      Alert.alert('Success', 'OTP verified successfully');
    } catch (err) {
      console.log('Error:', err);
      Alert.alert('Error', 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    console.log('Resending OTP...');
    try {
      setLoading(true);
      const newVerificationId = await auth.sendOtp(phoneNumber);
      setCurrentVerificationId(newVerificationId);
      setResendTimeout(60);
      setCanResend(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
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
          <Text style={styles.title}>Enter Your OTP</Text>
          <Text style={styles.subtitle}>{`OTP sent to ${phoneNumber}`}</Text>

          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <View
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}>
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />

          <Text style={styles.subTitle_2}>
            Didn't receive the OTP?{' '}
            {canResend ? (
              <Text style={styles.link} onPress={handleResendOtp}>
                Resend Code
              </Text>
            ) : (
              <Text style={styles.disabledLink}>
                Resend Code in {resendTimeout}s
              </Text>
            )}
          </Text>

          <TouchableOpacity
            style={{marginTop: 'auto', marginBottom: 15}}
            onPress={handleChangeNumber}>
            <Text style={styles.changeNumber}>Change Number</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.otpButton}
            onPress={verifyOTP}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.otpText}>Verify and Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OTPScreen;
