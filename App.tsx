import React, { useEffect, useState } from 'react';
import { AuthProvider } from './src/contexts/login/AuthProvider';
import { Router } from './src/routes/Route';
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
    return <Router />;
  };

  return (
    <ThemeProvider>
      <AuthProvider>{renderContent()}</AuthProvider>
    </ThemeProvider>
  );
}

export default App;
