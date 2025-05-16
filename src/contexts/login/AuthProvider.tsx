import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import {
  getAuthToken,
  getSkipLoginFlow,
  setAuthToken,
  setSkipLoginFlow,
  StorageService,
} from '../../services/localStorage/storage.service';
import {authService} from '../../services/api/authService';

type AuthContextData = {
  authData?: string;
  loading: boolean;
  skipUserLogin?: boolean;
  setSkipLogin: (skipLogin: boolean) => void;
  sendOtp(phoneNumber: string): Promise<string>;
  verifyOtp(
    phoneNumber: string,
    otp: string,
    verificationId: string,
  ): Promise<void>;
  signOut(): void;
  signUp(
    fullName: string,
    campusId: string,
    email: string,
    dob: string,
  ): Promise<void>;
  setAuthData(token: string): void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [authData, setAuthData] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [skipUserLogin, setSkipUserLogin] = useState<boolean | undefined>(
    false,
  );

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = getAuthToken();
        if (storedToken) {
          setAuthData(storedToken);
        }
        const skipLoginFlow = getSkipLoginFlow();
        setSkipUserLogin(skipLoginFlow);
      } catch (error) {
        console.error('Failed to load auth data from storage', error);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  });

  const setSkipLogin = (skipLogin: boolean): void => {
    setSkipLoginFlow(skipLogin);
    setSkipUserLogin(skipLogin);
  };
  const resetAuthState = (): void => {
    setAuthData(undefined);
    setSkipUserLogin(undefined);
    StorageService.clearAll();
  };
  const sendOtp = async (phoneNumber: string): Promise<string> => {
    return await authService.sendOtp(phoneNumber);
  };

  const verifyOtp = async (
    phoneNumber: string,
    otp: string,
    verificationId: string,
  ): Promise<void> => {
    const response = await authService.verifyOtp(
      phoneNumber,
      otp,
      verificationId,
    );
    const token = response?.session?.token;

    if (token) {
      setAuthData(token);
      setAuthToken(token);
    }
  };

  const signUp = async (
    fullName: string,
    campusId: string,
    email: string,
    dob: string,
  ): Promise<void> => {
    await authService.signUp(fullName, dob, campusId, email);
  };

  const signOut = (): void => {
    // authService.signOut().catch(console.error);
    resetAuthState();
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        loading,
        skipUserLogin,
        setSkipLogin,
        sendOtp,
        verifyOtp,
        signOut,
        signUp,
        setAuthData,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export {AuthProvider, useAuth};
