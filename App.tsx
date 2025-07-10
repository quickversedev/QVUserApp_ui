import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/login/AuthProvider';
import { Route } from './src/routes/Route';
import PermissionsScreen from './src/screens/permission/PermissionsScreen';
import { ThemeProvider } from './src/theme/ThemeContext';
import { checkFirstLaunch } from './src/utils/global/checkFirstLaunch';

function App(): React.JSX.Element {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [permissionsCompleted, setPermissionsCompleted] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const result = await checkFirstLaunch();
        setIsFirstLaunch(result);
      } catch (error) {
        setIsFirstLaunch(false);
      }
    };
    initializeApp();
  }, []);

  const renderContent = () => {
    if (isFirstLaunch && !permissionsCompleted) {
      return <PermissionsScreen onPermissionsComplete={() => setPermissionsCompleted(true)} />;
    }
    return <Route />;
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <AuthProvider>{renderContent()}</AuthProvider>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
