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
      localStorage.setItem('access_token', keycloak.token ?? ''); // ✅ Dùng consistent key
      localStorage.setItem('kc_refresh_token', keycloak.refreshToken ?? ''); // ✅ Consistent key
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
            // ✅ Try to use cached user if API fails
            if (cachedUser) {
              try {
                const userData = JSON.parse(cachedUser);
                setUser(userData);
                console.log('Using cached user profile due to API failure');
              } catch (e) {
                console.error('Failed to parse cached user:', e);
              }
            }
            setIsAuthLoading(false);
          });
      } else {
        setIsAuthLoading(false);
      }
    } else {
      // ✅ Try to recover from stored tokens before clearing
      const storedRefreshToken = localStorage.getItem('kc_refresh_token');
      const cachedUser = localStorage.getItem('user_profile');

      if (storedRefreshToken && cachedUser) {
        console.log('Attempting session recovery from stored data...');
        try {
          // Use cached user temporarily while trying to recover session
          const userData = JSON.parse(cachedUser);
          setUser(userData);
          setIsAuthLoading(false);

          // Note: Actual token refresh should be handled by Keycloak's event system
          // This just provides better UX by showing cached user data
        } catch (e) {
          console.error('Failed to recover session:', e);
          // Clear invalid data and reset state
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
  }, [initialized, keycloak.authenticated, setUser, setIsAuthLoading, keycloak]);

  return {
    user: null, // ❌ Không return từ đây nữa, dùng AppContext
    token: localStorage.getItem('access_token'), // ✅ Consistent key
    refreshToken: localStorage.getItem('kc_refresh_token'), // ✅ Consistent key
    isAuthenticated: initialized && keycloak.authenticated,
    isLoading: !initialized,
    login: () => keycloak.login(),
    logout: () => {
      // ✅ Clean all auth-related data
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