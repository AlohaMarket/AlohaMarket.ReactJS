import { useAuth } from '@/contexts';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './ui/LoadingSpinner';

type ProtectedRouteProps = {
    children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Store current path for redirect after login
            localStorage.setItem('authRedirectPath', location.pathname);
            // Use auth context login function
            login();
        }
    }, [isAuthenticated, isLoading, login, location.pathname]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : null;
}