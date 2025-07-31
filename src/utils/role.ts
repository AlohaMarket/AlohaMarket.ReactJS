import type { TokenPayload } from './token';

export function hasRole(requiredRole: string, tokenPayload: TokenPayload | null): boolean {
    if (!tokenPayload) return false;

    const roles = tokenPayload.realm_access?.roles || [];
    return roles.includes(requiredRole);
}

export function hasAnyRole(requiredRoles: string[], tokenPayload: TokenPayload | null): boolean {
    if (!tokenPayload) return false;

    const roles = tokenPayload.realm_access?.roles || [];
    return requiredRoles.some(role => roles.includes(role));
}

export function hasAllRoles(requiredRoles: string[], tokenPayload: TokenPayload | null): boolean {
    if (!tokenPayload) return false;

    const roles = tokenPayload.realm_access?.roles || [];
    return requiredRoles.every(role => roles.includes(role));
}

export function getUserRoles(tokenPayload: TokenPayload | null): string[] {
    return tokenPayload?.realm_access?.roles || [];
}

// Common role constants
export const ROLES = {
    ADMIN: 'ALOHA_ADMIN',
    USER: 'ALOHA_USER'
} as const;