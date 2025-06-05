import type { ReactNode } from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { keycloak } from '@/lib/keycloak';

interface KeycloakProviderProps {
     children: ReactNode;
}

const eventLogger = (event: unknown, error: unknown) => {
     console.log('onKeycloakEvent', event, error);
};

const tokenLogger = (tokens: unknown) => {
     console.log('onKeycloakTokens', tokens);
     
     // Update tokens in localStorage when they change
     if (keycloak.token && keycloak.refreshToken) {
          localStorage.setItem('token', keycloak.token);
          localStorage.setItem('refreshToken', keycloak.refreshToken);
     }
};

export function KeycloakProvider({ children }: KeycloakProviderProps) {
     return (
          <ReactKeycloakProvider
               authClient={keycloak}
               onEvent={eventLogger}
               onTokens={tokenLogger}
               initOptions={{
                    onLoad: 'check-sso',
                    checkLoginIframe: false,
                    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
               }}
          >
               {children}
          </ReactKeycloakProvider>
     );
}
