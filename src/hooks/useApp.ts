import { useContext } from 'react';
import { AppContext, type AppContextInterface } from '@/contexts/AppContext';

export function useApp(): AppContextInterface {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Convenience hooks for specific functionality
export function useAuth() {
  const {
    user,
    isAuthenticated,
    isAuthLoading,
    login,
    register,
    logout,
    updateUser
  } = useApp();
  
  return {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    login,
    register,
    logout,
    updateUser
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