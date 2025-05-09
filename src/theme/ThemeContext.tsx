// src/theme/ThemeContext.tsx
import React, {createContext, useContext, useEffect, useState} from 'react';
import {DefaultTheme} from '../assets/theme/defaultTheme';

type ButtonColors = {
  default: {
    background: string;
    text: string;
  };
  pressed: {
    background: string;
    text: string;
  };
  disabled: {
    background: string;
    text: string;
  };
};

export type BaseColors = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  success: string;
  error: string;
  warning: string;
};

type Colors = BaseColors & {
  button: ButtonColors;
};
type Typography = {
  h1: number;
  h2: number;
  subtitle: number;
  body: number;
  caption: number;
  fontFamily: string;
  lineHeightMultiplier: number;
};

export type Theme = {
  colors: Colors;
  typography: Typography;
};

type ThemeContextType = {
  theme: Theme;
  isLoading: boolean;
  error: Error | null;
  getColor: <T extends keyof BaseColors>(colorKey: T) => BaseColors[T];
  getButtonColor: (
    state: keyof ButtonColors,
    element: 'background' | 'text',
  ) => string;
  getTypography: (
    type: keyof Omit<Typography, 'fontFamily' | 'lineHeightMultiplier'>,
  ) => number;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const API_ENDPOINT = 'https://your-api.com/theme-config';

const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [theme, setTheme] = useState<Theme>(DefaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) throw new Error('Failed to fetch theme');

        const apiTheme = await response.json();
        const validatedTheme = validateTheme(apiTheme);

        setTheme(validatedTheme);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setTheme(DefaultTheme);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheme();
  }, []);

  const validateTheme = (apiTheme: any): Theme => {
    // Basic validation - expand according to your API contract
    const isValid =
      apiTheme?.colors?.button?.default?.background && apiTheme?.typography?.h1;

    return isValid ? apiTheme : DefaultTheme;
  };

  const getColor = <T extends keyof Colors>(colorKey: T): Colors[T] => {
    return theme.colors[colorKey] || DefaultTheme.colors[colorKey];
  };

  const getTypography = (
    type: keyof Omit<Typography, 'fontFamily' | 'lineHeightMultiplier'>,
  ): number => {
    return theme.typography[type] || DefaultTheme.typography[type];
  };

  const getButtonColor = (
    state: keyof ButtonColors,
    element: 'background' | 'text',
  ): string => {
    return (
      theme.colors.button[state][element] ||
      DefaultTheme.colors.button[state][element]
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isLoading,
        error,
        getColor,
        getTypography,
        getButtonColor,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export {ThemeProvider, useTheme};
