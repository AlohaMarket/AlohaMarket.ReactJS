import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { User } from '@/types/user.type';
import { getStoredToken, getStoredData, setStoredData } from '@/utils';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'vi';

export interface AppContextInterface {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;

  // Theme state
  theme: Theme;
  language: Language;
  isThemeLoading: boolean;

  // Auth actions
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;

  // Theme actions
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  toggleTheme: () => void;
  changeLanguage: (language: Language) => void;

  // Global reset
  reset: () => void;
}

const THEME_STORAGE_KEY = 'aloha_market_theme';
const LANGUAGE_STORAGE_KEY = 'aloha_market_language';

export const getInitialAppContext: () => AppContextInterface = () => ({
  // Auth state
  user: null,
  isAuthenticated: !!getStoredToken(),
  isAuthLoading: true,

  // Theme state
  theme: 'light',
  language: 'en',
  isThemeLoading: true,

  // Auth actions
  setUser: () => null,
  setIsAuthLoading: () => null,

  // Theme actions
  setTheme: () => null,
  setLanguage: () => null,
  toggleTheme: () => null,
  changeLanguage: () => null,

  // Global reset
  reset: () => null
});

const initialAppContext = getInitialAppContext();

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({
  children,
  defaultValue = initialAppContext
}: {
  children: ReactNode;
  defaultValue?: AppContextInterface;
}) => {
  const { i18n } = useTranslation();

  // Auth state
  const [user, setUser] = useState<User | null>(defaultValue.user);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(defaultValue.isAuthLoading);

  // Theme state
  const [theme, setTheme] = useState<Theme>(defaultValue.theme);
  const [language, setLanguage] = useState<Language>(defaultValue.language);
  const [isThemeLoading, setIsThemeLoading] = useState<boolean>(defaultValue.isThemeLoading);

  // Computed values
  const isAuthenticated = !!user;

  // Initialize theme and language
  useEffect(() => {
    const savedTheme = getStoredData<Theme>(THEME_STORAGE_KEY);
    const savedLanguage = getStoredData<Language>(LANGUAGE_STORAGE_KEY);

    // Set theme
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    // Set language
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else {
      // Check browser language
      const browserLang = navigator.language.startsWith('vi') ? 'vi' : 'en';
      setLanguage(browserLang);
      i18n.changeLanguage(browserLang);
    }

    setIsThemeLoading(false);
  }, [i18n]);

  // Apply theme to document
  useEffect(() => {
    if (!isThemeLoading) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      setStoredData(THEME_STORAGE_KEY, theme);
    }
  }, [theme, isThemeLoading]);

  // Save language preference
  useEffect(() => {
    if (!isThemeLoading) {
      setStoredData(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language, isThemeLoading]);

  // Theme actions
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  // Global reset function
  const reset = () => {
    // Reset auth state
    setUser(null);
    setIsAuthLoading(false);

    // Reset theme to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');

    // Reset language to browser preference
    const browserLang = navigator.language.startsWith('vi') ? 'vi' : 'en';
    setLanguage(browserLang);
    i18n.changeLanguage(browserLang);
    setIsThemeLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        // Auth state
        user,
        isAuthenticated,
        isAuthLoading,

        // Theme state
        theme,
        language,
        isThemeLoading,

        // Auth actions
        setUser,
        setIsAuthLoading,

        // Theme actions
        setTheme,
        setLanguage,
        toggleTheme,
        changeLanguage,

        // Global reset
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};