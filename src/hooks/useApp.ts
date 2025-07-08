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
      // Always save tokens when authenticated
      localStorage.setItem('token', keycloak.token ?? '');
      localStorage.setItem('refreshToken', keycloak.refreshToken ?? '');
      localStorage.setItem('user', JSON.stringify(keycloak.tokenParsed));

      // Fetch user profile if not in auth callback
      if (!window.location.pathname.startsWith('/auth/callback')) {
        authApi.getProfile()
          .then(user => {
            setUser(user);
            setIsAuthLoading(false);
          })
          .catch(error => {
            console.error('Failed to fetch user info:', error);
            setIsAuthLoading(false);
          });
      } else {
        setIsAuthLoading(false);
      }

      // Setup token refresh handler
      keycloak.onTokenExpired = () => {
        keycloak.updateToken(70).then((refreshed) => {
          if (refreshed) {
            localStorage.setItem('token', keycloak.token ?? '');
            localStorage.setItem('refreshToken', keycloak.refreshToken ?? '');
            localStorage.setItem('user', JSON.stringify(keycloak.tokenParsed));
          }
        }).catch((error) => {
          console.error('Failed to refresh token:', error);
        });
      };
    } else {
      setIsAuthLoading(false);
    }
  }, [initialized, keycloak.authenticated, setUser, setIsAuthLoading, keycloak]);

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
    login: () => keycloak.login(),
    logout,
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