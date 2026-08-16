import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  isDark: boolean;
};

const STORAGE_KEY = '@odi_theme';
const LEGACY_STORAGE_KEY = 'odi_theme';

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  isDark: true,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setThemeState] = useState<Theme>(colorScheme === 'light' ? 'light' : 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setThemeState(storedTheme);
          return;
        }

        const legacyTheme = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyTheme === 'light' || legacyTheme === 'dark') {
          setThemeState(legacyTheme);
          await AsyncStorage.setItem(STORAGE_KEY, legacyTheme);
        }
      } catch (error) {
        console.warn('Theme load failed:', error);
      }
    };

    loadTheme();
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    AsyncStorage.setItem(STORAGE_KEY, t).catch(() => {});
    AsyncStorage.setItem(LEGACY_STORAGE_KEY, t).catch(() => {});
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
