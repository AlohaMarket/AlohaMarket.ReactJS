import { keycloak } from '@/lib/keycloak';

export interface TokenPayload {
    sub?: string;
    email?: string;
    name?: string;
    preferred_username?: string;
    realm_access?: {
        roles?: string[];
    };
    resource_access?: {
        [key: string]: {
            roles?: string[];
        };
    };
    exp?: number;
    iat?: number;
}

export function parseToken(token?: string): TokenPayload | null {
    try {
        // If using Keycloak, prefer the parsed token from Keycloak
        if (keycloak.authenticated && keycloak.tokenParsed) {
            return keycloak.tokenParsed as TokenPayload;
        }

        // Fallback to manual parsing if token is provided
        if (!token) return null;

        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload) as TokenPayload;
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
}

export function isTokenExpired(token?: string): boolean {
    const payload = parseToken(token);
    if (!payload?.exp) return true;

    return Date.now() >= payload.exp * 1000;
}

export function getTokenRoles(token?: string): string[] {
    const payload = parseToken(token);
    return payload?.realm_access?.roles || [];
}