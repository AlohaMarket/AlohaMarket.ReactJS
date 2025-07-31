import type { ReactNode } from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { keycloak } from '@/lib/keycloak';
import { setStoredToken, removeStoredToken } from '@/utils';
import { getKeycloakInitOptionsForBrowser, logBrowserCompatibility, detectBrowser } from '@/utils/browser-detection';

interface KeycloakProviderProps {
     children: ReactNode;
}

const eventLogger = async (event: unknown, error: unknown) => {
     console.log('onKeycloakEvent', event, error);

     if (event === 'onReady') {
          console.log('Keycloak ready - authenticated:', keycloak.authenticated);
          console.log('Current URL:', window.location.href);
          console.log('Browser detected as strict:', detectBrowser().isStrict);

          if (keycloak.authenticated) {
               try {
                    // Force token refresh on initial load
                    const refreshed = await keycloak.updateToken(-1);
                    console.log('Token refresh on ready:', refreshed);

                    if (refreshed && keycloak.token) {
                         setStoredToken(keycloak.token);
                         // Store refresh token separately
                         localStorage.setItem('kc_refresh_token', keycloak.refreshToken || '');
                         // Store full user profile
                         if (keycloak.tokenParsed) {
                              localStorage.setItem('user_profile', JSON.stringify(keycloak.tokenParsed));
                         }
                    }
               } catch (e) {
                    console.error('Failed to refresh token on ready:', e);
                    // ✅ Try to recover from stored token
                    const storedRefreshToken = localStorage.getItem('kc_refresh_token');

                    if (storedRefreshToken) {
                         try {
                              // Try to use refresh token to get new access token
                              await keycloak.updateToken(-1);
                              if (keycloak.token) {
                                   setStoredToken(keycloak.token);
                                   return;
                              }
                         } catch (refreshError) {
                              console.error('Recovery attempt failed:', refreshError);
                         }
                    }

                    // If all recovery attempts fail
                    const browser = detectBrowser();
                    if (browser.isStrict) {
                         console.log('All recovery attempts failed on strict browser - cleaning tokens without logout');
                         removeStoredToken();
                         localStorage.removeItem('user_profile');
                         localStorage.removeItem('kc_refresh_token');
                    } else {
                         // For normal browsers, proceed with logout
                         keycloak.logout();
                    }
               }
          } else {
               // ✅ Not authenticated, check if we have stored tokens to recover
               const storedRefreshToken = localStorage.getItem('kc_refresh_token');
               if (storedRefreshToken) {
                    console.log('Attempting to recover session with stored refresh token...');
                    try {
                         // Set the refresh token and try to refresh
                         keycloak.refreshToken = storedRefreshToken;
                         await keycloak.updateToken(-1);
                         if (keycloak.authenticated && keycloak.token) {
                              setStoredToken(keycloak.token);
                              console.log('Session recovered successfully');
                         }
                    } catch (recoveryError) {
                         console.error('Session recovery failed:', recoveryError);
                         // Clean up invalid tokens
                         localStorage.removeItem('access_token');
                         localStorage.removeItem('kc_refresh_token');
                         localStorage.removeItem('user_profile');
                    }
               }
          }
     }

     if (event === 'onAuthSuccess' && keycloak.token) {
          setStoredToken(keycloak.token);
          // ✅ Store refresh token on auth success
          if (keycloak.refreshToken) {
               localStorage.setItem('kc_refresh_token', keycloak.refreshToken);
          }
     }

     if (event === 'onAuthRefreshSuccess') {
          if (keycloak.token) {
               setStoredToken(keycloak.token);
               // ✅ Update refresh token on refresh success
               if (keycloak.refreshToken) {
                    localStorage.setItem('kc_refresh_token', keycloak.refreshToken);
               }
          }
     }

     if (event === 'onAuthRefreshError') {
          console.error('Auth refresh error:', error);

          // ✅ Don't auto-logout on strict browsers - just clean up tokens
          const browser = detectBrowser();
          if (browser.isStrict) {
               console.log('Refresh error on strict browser - cleaning tokens without logout');
               removeStoredToken();
               localStorage.removeItem('user_profile');
               localStorage.removeItem('kc_refresh_token');
          } else {
               // For normal browsers, proceed with logout
               keycloak.logout();
          }
     }

     if (event === 'onAuthLogout') {
          removeStoredToken();
          localStorage.removeItem('user_profile');
          localStorage.removeItem('kc_refresh_token'); // ✅ Clean refresh token
     }
};

const tokenLogger = (tokens: unknown) => {
     console.log('onKeycloakTokens', tokens);
};

export function KeycloakProvider({ children }: KeycloakProviderProps) {
     // ✅ Log browser compatibility info
     logBrowserCompatibility();

     // ✅ Get browser-specific init options
     const initOptions = getKeycloakInitOptionsForBrowser();

     return (
          <ReactKeycloakProvider
               authClient={keycloak}
               onEvent={eventLogger}
               onTokens={tokenLogger}
               initOptions={initOptions}
          >
               {children}
          </ReactKeycloakProvider>
     );
}
