import type { ReactNode } from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { keycloak } from '@/lib/keycloak';
import { setStoredToken, removeStoredToken } from '@/utils';

interface KeycloakProviderProps {
     children: ReactNode;
}

const eventLogger = async (event: unknown, error: unknown) => {
     console.log('onKeycloakEvent', event, error);

     if (event === 'onReady') {
          console.log('Keycloak ready - authenticated:', keycloak.authenticated);
          
          if (keycloak.authenticated) {
               try {
                    // Force token refresh on initial load
                    const refreshed = await keycloak.updateToken(-1);
                    console.log('Token refresh on ready:', refreshed);
                    
                    if (refreshed && keycloak.token) {
                         setStoredToken(keycloak.token);
                         // Store full user profile
                         if (keycloak.tokenParsed) {
                              localStorage.setItem('user_profile', JSON.stringify(keycloak.tokenParsed));
                         }
                    }
               } catch (e) {
                    console.error('Failed to refresh token on ready:', e);
                    keycloak.logout();
               }
          }
     }

     if (event === 'onAuthSuccess' && keycloak.token) {
          setStoredToken(keycloak.token);
     }

     if (event === 'onAuthRefreshSuccess') {
          if (keycloak.token) {
               setStoredToken(keycloak.token);
          }
     }

     if (event === 'onAuthRefreshError') {
          console.error('Auth refresh error:', error);
          keycloak.logout();
     }

     if (event === 'onAuthLogout') {
          removeStoredToken();
          localStorage.removeItem('user_profile');
     }
};

const tokenLogger = (tokens: unknown) => {
     console.log('onKeycloakTokens', tokens);
};

export function KeycloakProvider({ children }: KeycloakProviderProps) {
     return (
          <ReactKeycloakProvider
               authClient={keycloak}
               onEvent={eventLogger}
               onTokens={tokenLogger}
               initOptions={{
                    onLoad: 'check-sso',
                    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                    pkceMethod: 'S256',
                    checkLoginIframe: false,
                    enableLogging: true,
                    // More aggressive token refresh settings
                    minValiditySeconds: 70, // Refresh if token validity is less than 70 seconds
                    updateMinValidity: 60, // Update token if it's older than 60 seconds
                    timeSkew: 10, // Allow for 10 seconds time skew
                    responseMode: 'fragment',
                    flow: 'standard'
               }}
          >
               {children}
          </ReactKeycloakProvider>
     );
}
