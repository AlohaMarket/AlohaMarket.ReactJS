import Keycloak from 'keycloak-js';

export const keycloakConfig = {
    url: import.meta.env['VITE_KEYCLOAK_URL'],
    realm: import.meta.env['VITE_KEYCLOAK_REALM'],
    clientId: import.meta.env['VITE_KEYCLOAK_CLIENT_ID']
}

class KeycloakInstance extends Keycloak {
    private isInitialized = false;

    async customInit(options: Keycloak.KeycloakInitOptions) {
        if (this.isInitialized) {
            console.log('Keycloak already initialized');
            return;
        }
        
        try {
            const auth = await this.init(options);
            this.isInitialized = true;
            return auth;
        } catch (error) {
            console.error('Failed to initialize Keycloak:', error);
            throw error;
        }
    }
}

export const keycloak = new KeycloakInstance(keycloakConfig);