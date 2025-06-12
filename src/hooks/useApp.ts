import { useContext, useEffect } from 'react';
import { AppContext } from '@/contexts/AppContext';
import { useKeycloak } from '@react-keycloak/web';

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
      const userProfile = {
        id: keycloak.subject ?? '',
        email: keycloak.tokenParsed?.['email'] ?? '',
        name: keycloak.tokenParsed?.['name'] ?? '',
        avatar: keycloak.tokenParsed?.['avatar_url'] ?? '',
        firstName: keycloak.tokenParsed?.['given_name'] ?? '',
        lastName: keycloak.tokenParsed?.['family_name'] ?? '',
      };

      localStorage.setItem('user', JSON.stringify(userProfile));
      localStorage.setItem('token', keycloak.token ?? '');
      localStorage.setItem('refreshToken', keycloak.refreshToken ?? '');
      setUser(userProfile);

      keycloak.onTokenExpired = () => {
        keycloak.updateToken(70).then((refreshed) => {
          if (refreshed) {
            localStorage.setItem('token', keycloak.token ?? '');
            localStorage.setItem('refreshToken', keycloak.refreshToken ?? '');
          }
        }).catch(() => {
          logout();
        });
      };
    } else {
      setUser(null);
    }

    setIsAuthLoading(false);
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
    register: () => keycloak.register({ redirectUri: window.location.origin })
  };
}

export function useCart() {
  const {
    cartItems: items,
    totalItems,
    totalPrice,
    isCartLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  } = useApp();

  return {
    items,
    totalItems,
    totalPrice,
    isLoading: isCartLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
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