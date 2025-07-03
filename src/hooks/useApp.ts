import { useContext, useEffect } from 'react';
import { AppContext } from '@/contexts/AppContext';
import { useKeycloak } from '@react-keycloak/web';
import { authApi } from '@/apis/auth';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation(); // Get current route

  const isRegistrationFlow = location.pathname === '/after-register';

  useEffect(() => {
    if (!initialized) return;

    setIsAuthLoading(true);

    if (keycloak.authenticated) {
      localStorage.setItem('token', keycloak.token ?? '');
      localStorage.setItem('refreshToken', keycloak.refreshToken ?? '');
      localStorage.setItem('user', JSON.stringify(keycloak.tokenParsed));

      if (!isRegistrationFlow) {
        // Fetch user profile only if not in registration flow
        authApi.getProfile()
          .then((user) => {
            setUser(user);
          })
          .catch((error) => {
            console.error('Failed to fetch user info:', error);
          })
          .finally(() => {
            setIsAuthLoading(false);
          });
      } else {
        // Skip fetching user profile during registration flow
        setIsAuthLoading(false);
      }

      keycloak.onTokenExpired = () => {
        keycloak.updateToken(70).then((refreshed) => {
          if (refreshed) {
            localStorage.setItem('token', keycloak.token ?? '');
            localStorage.setItem('refreshToken', keycloak.refreshToken ?? '');
          }
        }).catch((error) => {
          console.error('Failed to refresh token:', error);
          // Don't automatically logout on token refresh failure
          // This prevents logout loops
        });
      };
    }
  }, [initialized, keycloak.authenticated]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    keycloak.logout({
      redirectUri: window.location.origin
    });
  };

  return {
    user: keycloak.authenticated
      ? JSON.parse(localStorage.getItem('user') || 'null')
      : null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: initialized && keycloak.authenticated,
    isLoading: !initialized,
    login: () => keycloak.login({ redirectUri: window.location.origin }),
    logout,
    register: () => keycloak.register({
      redirectUri: window.location.origin + '/after-register'
    }),
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