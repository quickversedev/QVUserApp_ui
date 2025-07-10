import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { ThemeText } from '../../components/common/theme/ThemeText';
import { useAuth } from '../../contexts/login/AuthProvider';
import { LoginStackParamList } from '../../navigation/LoginNavigation';
import { useTheme } from '../../theme/ThemeContext';

const { height } = Dimensions.get('window');

const CELL_COUNT = 4;
type LoginScreenRouteProp = RouteProp<LoginStackParamList, 'OTPScreen'>;
type OTPScreenNavigationProp = StackNavigationProp<LoginStackParamList, 'OTPScreen'>;

const OTPScreen: React.FC = () => {
  const route = useRoute<LoginScreenRouteProp>();
  const { phoneNumber, verificationId } = route.params;
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Resend OTP Timer
  const [resendTimeout, setResendTimeout] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [currentVerificationId, setCurrentVerificationId] = useState(verificationId);

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const auth = useAuth();
  const { theme } = useTheme();

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
      Alert.alert('Error', 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

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
      borderRadius: 16,
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
      fontWeight: 'bold',
      textAlign: 'center',
    },
    subtitle: {
      textAlign: 'center',
      marginTop: 5,
      marginBottom: 16,
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
      borderWidth: 1,
      borderRadius: 8,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
    },
    focusCell: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    unfocusedCell: {
      borderColor: theme.colors.border,
    },
    subTitle_2: {
      textAlign: 'center',
      marginTop: 12,
    },
    link: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    otpButton: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 8,
      paddingVertical: 14,
      marginTop: 'auto',
    },
    otpText: {
      textAlign: 'center',
      fontWeight: 'bold',
    },
    resendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    resendText: {
      marginRight: 4,
    },
    timerText: {
      marginLeft: 4,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ImageBackground
          source={require('../../assets/images/bg_1.png')}
          style={styles.topBackground}
          resizeMode="cover"
        />
        <View style={styles.logoContainer}>
          <Image style={styles.topLogo} source={require('../../assets/images/logo_qv.png')} />
        </View>

        <View style={styles.card}>
          <ThemeText variant="h2" style={styles.title}>
            Verify OTP
          </ThemeText>
          <ThemeText variant="subtitle" color={theme.colors.subText} style={styles.subtitle}>
            Enter the OTP sent to +91 {phoneNumber}
          </ThemeText>

          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <View
                key={index}
                style={[styles.cell, isFocused ? styles.focusCell : styles.unfocusedCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                <ThemeText variant="h2" color={theme.colors.text}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </ThemeText>
              </View>
            )}
          />

          <View style={styles.resendContainer}>
            <ThemeText variant="caption" color={theme.colors.subText} style={styles.resendText}>
              Didn't receive OTP?
            </ThemeText>
            <TouchableOpacity onPress={handleResendOtp} disabled={!canResend || loading}>
              <ThemeText
                variant="caption"
                color={canResend ? theme.colors.primary : theme.colors.subText}
                style={styles.link}
              >
                Resend
              </ThemeText>
            </TouchableOpacity>
            {!canResend && (
              <ThemeText variant="caption" color={theme.colors.subText} style={styles.timerText}>
                ({resendTimeout}s)
              </ThemeText>
            )}
          </View>

          <TouchableOpacity
            style={[styles.otpButton, loading && { opacity: 0.7 }]}
            onPress={verifyOTP}
            disabled={loading || value.length !== CELL_COUNT}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <ThemeText variant="body" color={theme.colors.background} style={styles.otpText}>
                Verify OTP
              </ThemeText>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleChangeNumber}>
            <ThemeText
              variant="caption"
              color={theme.colors.primary}
              style={[styles.link, { textAlign: 'center' }]}
            >
              Change Number
            </ThemeText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OTPScreen;
