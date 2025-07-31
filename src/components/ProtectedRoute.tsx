import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useApp';
import { parseToken } from '@/utils/token';
import { hasRole, hasAnyRole } from '@/utils/role';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
    requiredRoles?: string[];
    requireAll?: boolean;
    fallbackPath?: string;
    timeout?: number;
    allowAutoLogin?: boolean;
}

export default function ProtectedRoute({
    children,
    requiredRole,
    requiredRoles,
    requireAll = false,
    fallbackPath = '/required-login',
    timeout = 10000,
    allowAutoLogin = false
}: ProtectedRouteProps) {
    const { isAuthenticated, token, isLoading, login } = useAuth();
    const location = useLocation();
    const [hasTimedOut, setHasTimedOut] = useState(false);

    // Timeout handling from AdminProtectedRoute
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (isLoading) {
                setHasTimedOut(true);
                console.warn('Authentication check timed out');
            }
        }, timeout);

        return () => clearTimeout(timeoutId);
    }, [isLoading, timeout]);

    // Auto-login for admin routes if needed
    useEffect(() => {
        if (!isLoading && !isAuthenticated && !hasTimedOut && allowAutoLogin) {
            localStorage.setItem('authRedirectPath', location.pathname + location.search);
            login();
        }
    }, [isAuthenticated, isLoading, login, location.pathname, location.search, hasTimedOut, allowAutoLogin]);

    // Handle timeout
    if (hasTimedOut) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Authentication Timeout</h2>
                    <p className="text-gray-600 mb-4">Authentication is taking longer than expected.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }

    // Show loading while authentication is being determined
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Checking authentication...</p>
            </div>
        );
    }

    // Handle unauthenticated users
    if (!isAuthenticated || !token) {
        localStorage.setItem('authRedirectPath', location.pathname + location.search);

        // For admin routes or when auto-login is enabled, redirect to Keycloak
        if (allowAutoLogin) {
            return (
                <div className="flex flex-col justify-center items-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
                        <p className="text-gray-600 mb-4">Redirecting to login...</p>
                        <LoadingSpinner size="md" />
                    </div>
                </div>
            );
        }

        return <Navigate to={fallbackPath} replace />;
    }

    // Parse token to get user roles
    const payload = parseToken(token);

    // Check role requirements
    let isAuthorized = true;

    if (requiredRole) {
        isAuthorized = hasRole(requiredRole, payload);
    } else if (requiredRoles && requiredRoles.length > 0) {
        if (requireAll) {
            isAuthorized = requiredRoles.every(role => hasRole(role, payload));
        } else {
            isAuthorized = hasAnyRole(requiredRoles, payload);
        }
    }

    // Redirect if not authorized
    if (!isAuthorized) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}
