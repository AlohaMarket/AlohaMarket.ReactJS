/**
 * Browser detection utilities for handling auth compatibility
 */

export interface BrowserInfo {
    name: string;
    version: string;
    isStrict: boolean; // Browsers with strict third-party cookie policies
    supportsKeycloakIframe: boolean;
}

interface BraveNavigator extends Navigator {
    brave?: {
        isBrave?: () => Promise<boolean>;
    };
}

export function detectBrowser(): BrowserInfo {
    const userAgent = navigator.userAgent;

    // Detect Brave - improved detection
    if ('brave' in navigator && 'isBrave' in ((navigator as BraveNavigator).brave || {})) {
        return {
            name: 'Brave',
            version: 'unknown',
            isStrict: true,
            supportsKeycloakIframe: false
        };
    }

    // Additional Brave detection methods
    if (userAgent.includes('Brave/') || userAgent.includes('brave/')) {
        return {
            name: 'Brave',
            version: 'unknown',
            isStrict: true,
            supportsKeycloakIframe: false
        };
    }

    // Fallback Brave detection - check for specific Brave patterns
    if (userAgent.includes('Chrome/') && !userAgent.includes('Edge/') && !userAgent.includes('OPR/')) {
        // Additional checks that might indicate Brave
        if (navigator.userAgent.includes('Safari/') &&
            !navigator.vendor?.includes('Google') &&
            !navigator.vendor?.includes('Apple')) {
            console.log('Potential Brave browser detected via fallback method');
            return {
                name: 'Brave (detected)',
                version: 'unknown',
                isStrict: true,
                supportsKeycloakIframe: false
            };
        }
    }

    // Detect Firefox
    if (userAgent.includes('Firefox/')) {
        const version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'unknown';
        return {
            name: 'Firefox',
            version,
            isStrict: true,
            supportsKeycloakIframe: parseInt(version) >= 85 // Firefox 85+ has stricter policies
        };
    }

    // Detect Safari
    if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) {
        return {
            name: 'Safari',
            version: 'unknown',
            isStrict: true,
            supportsKeycloakIframe: false
        };
    }

    // Detect Chrome-based browsers (Edge, Chrome, etc.)
    if (userAgent.includes('Chrome/')) {
        const version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'unknown';

        // Detect Edge
        if (userAgent.includes('Edg/')) {
            return {
                name: 'Edge',
                version: userAgent.match(/Edg\/(\d+)/)?.[1] || 'unknown',
                isStrict: false,
                supportsKeycloakIframe: true
            };
        }

        // Default Chrome
        return {
            name: 'Chrome',
            version,
            isStrict: false,
            supportsKeycloakIframe: true
        };
    }

    // Default fallback
    return {
        name: 'Unknown',
        version: 'unknown',
        isStrict: true, // Be conservative
        supportsKeycloakIframe: false
    };
}

export function getKeycloakInitOptionsForBrowser(): Record<string, unknown> {
    const browser = detectBrowser();

    if (browser.isStrict) {
        // For strict browsers, use more conservative settings but allow normal app access
        return {
            onLoad: 'check-sso', // ✅ Changed from 'login-required' to allow normal app usage
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            pkceMethod: 'S256',
            checkLoginIframe: false, // Disable iframe checks for strict browsers
            enableLogging: true,
            minValiditySeconds: 300, // 5 minutes - longer validity for stability
            updateMinValidity: 240, // 4 minutes
            timeSkew: 30, // More lenient time skew
            responseMode: 'query', // Use query instead of fragment
            flow: 'standard',
            // Additional strict browser settings
            checkLoginIframeInterval: 0, // Disable periodic checks
            messageReceiveTimeout: 15000, // Longer timeout
            silentCheckSsoFallback: false, // ✅ Disable fallback that might trigger redirect
            promiseType: 'native',
            enableBrowserState: true,
            // Try to prevent session issues
            scope: 'openid profile email',
            redirectUri: window.location.origin + '/auth/callback',
            // ✅ Additional settings to prevent unwanted redirects
            onInitError: function (error: unknown) {
                console.warn('Keycloak init error (will continue normally):', error);
                // Don't throw - just log and continue
            },
            // ✅ Be more lenient with SSL and other strict browser issues
            enableCors: true,
            loadUserProfileAtStartUp: false // ✅ Don't auto-load profile on startup
        };
    } else {
        // For standard browsers, use default settings
        return {
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            pkceMethod: 'S256',
            checkLoginIframe: true,
            enableLogging: true,
            minValiditySeconds: 70,
            updateMinValidity: 60,
            timeSkew: 10,
            responseMode: 'fragment',
            flow: 'standard',
            checkLoginIframeInterval: 5,
            messageReceiveTimeout: 10000,
            silentCheckSsoFallback: false,
            promiseType: 'native',
            enableBrowserState: true
        };
    }
}

export function shouldUseTokenRecovery(): boolean {
    const browser = detectBrowser();
    return browser.isStrict; // Use token recovery for strict browsers
}

export function logBrowserCompatibility(): void {
    const browser = detectBrowser();
    console.log('🔍 Browser Detection:', {
        name: browser.name,
        version: browser.version,
        isStrict: browser.isStrict,
        supportsKeycloakIframe: browser.supportsKeycloakIframe,
        useTokenRecovery: shouldUseTokenRecovery(),
        userAgent: navigator.userAgent
    });

    if (browser.isStrict) {
        console.warn('⚠️ Strict browser detected. Using conservative auth settings with check-sso (NOT login-required).');
        console.log('✅ App will allow normal browsing without forced authentication.');
    } else {
        console.log('✅ Standard browser detected. Using default auth settings.');
    }
}
