import {Theme} from '../../theme/ThemeContext';

// src/assets/theme/defaultTheme.ts
export const DefaultTheme: Theme = {
  colors: {
    primary: '#2A5C8D',
    secondary: '#5C8D2A',
    background: '#FFFFFF',
    text: '#333333',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    button: {
      default: {
        background: '#2A5C8D',
        text: '#FFFFFF',
      },
      pressed: {
        background: '#1E4263',
        text: '#FFFFFF',
      },
      disabled: {
        background: '#CCCCCC',
        text: '#666666',
      },
    },
  },
  typography: {
    h1: 32,
    h2: 24,
    subtitle: 18,
    body: 16,
    caption: 12,
    fontFamily: 'System',
    lineHeightMultiplier: 1.4,
  },
};
