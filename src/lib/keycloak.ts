import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: import.meta.env['VITE_KEYCLOAK_URL'],
    realm: import.meta.env['VITE_KEYCLOAK_REALM'],
    clientId: import.meta.env['VITE_KEYCLOAK_CLIENT_ID'],
});

// Configure default options
const defaultOptions = {
    redirectUri: window.location.origin + '/auth/callback'
};

// Wrap original methods to always use our callback URL
const originalLogin = keycloak.login.bind(keycloak);
const originalRegister = keycloak.register.bind(keycloak);

keycloak.login = (options = {}) => originalLogin({ ...defaultOptions, ...options });
keycloak.register = (options = {}) => originalRegister({ ...defaultOptions, ...options });

export { keycloak };