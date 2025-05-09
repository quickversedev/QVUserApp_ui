// import React from 'react';
// import {ThemeProvider} from './src/theme/ThemeContext';
// import HomeScreen from './src/screens/Home/HomeScreen';

// const App = () => {
//   return (
//     <ThemeProvider>
//       <HomeScreen />
//     </ThemeProvider>
//   );
// };

// export default App;
import React from 'react';

import {AuthProvider} from './src/contexts/login/AuthProvider';
import {Router} from './src/routes/Route';
import {ThemeProvider} from './src/theme/ThemeContext';

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
