import { useContext, useEffect } from 'react';
import { AppContext } from '@/contexts/AppContext';
import { useKeycloak } from '@react-keycloak/web';
import { authApi } from '@/apis/auth';

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function useAuth() {
  const { keycloak, initialized } = useKeycloak();
  const { setUser, setIsAuthLoading } = useApp();

  useEffect(() => {
    if (!initialized) return;
    setIsAuthLoading(true);

    if (keycloak.authenticated) {
      // Save Keycloak tokens
      localStorage.setItem('token', keycloak.token ?? '');
      localStorage.setItem('refreshToken', keycloak.refreshToken ?? '');
      localStorage.setItem('keycloak_user', JSON.stringify(keycloak.tokenParsed));

      // Fetch and persist full user profile
      if (!window.location.pathname.startsWith('/auth/callback')) {
        const cachedUser = localStorage.getItem('user_profile');

        if (cachedUser) {
          // Use cached user first for better UX
          try {
            const userData = JSON.parse(cachedUser);
            setUser(userData);
          } catch (e) {
            console.error('Invalid cached user data:', e);
          }
        }

        // Then fetch fresh data
        authApi.getProfile()
          .then(user => {
            setUser(user);
            // ✅ Persist full user profile
            localStorage.setItem('user_profile', JSON.stringify(user));
            setIsAuthLoading(false);
          })
          .catch(error => {
            console.error('Failed to fetch user info:', error);
            setIsAuthLoading(false);
          });
      } else {
        setIsAuthLoading(false);
      }
    } else {
      // Clear all user data on logout
      localStorage.removeItem('user_profile');
      localStorage.removeItem('keycloak_user');
      setUser(null);
      setIsAuthLoading(false);
    }
  }, [initialized, keycloak.authenticated, setUser, setIsAuthLoading, keycloak]);

  return {
    user: null, // ❌ Không return từ đây nữa, dùng AppContext
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: initialized && keycloak.authenticated,
    isLoading: !initialized,
    login: () => keycloak.login(),
    logout: () => {
      localStorage.clear();
      setUser(null);
      keycloak.logout({ redirectUri: window.location.origin });
    },
    register: () => keycloak.register(),
  };
}

export function useTheme() {
  const {
    theme,
    language,
    isThemeLoading,
    toggleTheme,
    setTheme,
    changeLanguage
  } = useApp();

  return {
    theme,
    language,
    isLoading: isThemeLoading,
    toggleTheme,
    setTheme,
    changeLanguage
  };
}