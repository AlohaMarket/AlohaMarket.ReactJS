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
      // Save Keycloak tokens với consistent naming
      localStorage.setItem('access_token', keycloak.token ?? '');
      localStorage.setItem('kc_refresh_token', keycloak.refreshToken ?? '');
      localStorage.setItem('keycloak_user', JSON.stringify(keycloak.tokenParsed));

      // Fetch and persist full user profile - but skip if on AuthCallback page
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

        // Add a small delay to avoid race condition with AuthCallback
        setTimeout(() => {
          // Then fetch fresh data
          authApi.getProfile()
            .then(user => {
              setUser(user);
              localStorage.setItem('user_profile', JSON.stringify(user));
              setIsAuthLoading(false);
            })
            .catch(error => {
              if (cachedUser) {
                try {
                  const userData = JSON.parse(cachedUser);
                  setUser(userData);
                } catch (e) {
                  console.error('Failed to parse cached user:', e);
                }
              }
              setIsAuthLoading(false);
            });
        }, 100);
      } else {
        setIsAuthLoading(false);
      }
    } else {
      const storedRefreshToken = localStorage.getItem('kc_refresh_token');
      const cachedUser = localStorage.getItem('user_profile');

      if (storedRefreshToken && cachedUser) {
        console.log('Attempting session recovery from stored data...');
        try {
          const userData = JSON.parse(cachedUser);
          setUser(userData);
          setIsAuthLoading(false);
        } catch (e) {
          localStorage.removeItem('user_profile');
          localStorage.removeItem('keycloak_user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('kc_refresh_token');
          setUser(null);
          setIsAuthLoading(false);
        }
      } else {
        // Clear all user data on logout
        localStorage.removeItem('user_profile');
        localStorage.removeItem('keycloak_user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('kc_refresh_token');
        setUser(null);
        setIsAuthLoading(false);
      }
    }
  }, [initialized, keycloak.authenticated, keycloak.token, keycloak.refreshToken, keycloak.tokenParsed, setUser, setIsAuthLoading]);

  return {
    user: null,
    token: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('kc_refresh_token'),
    isAuthenticated: initialized && keycloak.authenticated,
    isLoading: !initialized,
    login: () => keycloak.login(),
    logout: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('kc_refresh_token');
      localStorage.removeItem('user_profile');
      localStorage.removeItem('keycloak_user');
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