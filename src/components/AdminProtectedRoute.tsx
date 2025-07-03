import { useAuth } from '@/contexts';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from './ui/LoadingSpinner';

type ProtectedRouteProps = {
    children: React.ReactNode;
    timeout?: number; // Optional timeout in milliseconds
};

export default function AdminProtectedRoute({ children, timeout = 10000 }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, login } = useAuth();
    const location = useLocation();
    const [hasTimedOut, setHasTimedOut] = useState(false);

    useEffect(() => {
        // Set up timeout
        const timeoutId = setTimeout(() => {
            if (isLoading) {
                setHasTimedOut(true);
                console.warn('Authentication check timed out');
            }
        }, timeout);

        return () => clearTimeout(timeoutId);
    }, [isLoading, timeout]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated && !hasTimedOut) {
            // Store current path for redirect after login
            localStorage.setItem('authRedirectPath', location.pathname);
            // Use auth context login function
            login();
        }
    }, [isAuthenticated, isLoading, login, location.pathname, hasTimedOut]);

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

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Checking authentication...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
                    <p className="text-gray-600 mb-4">You need to be logged in to access this page.</p>
                    <button 
                        onClick={() => login()} 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
