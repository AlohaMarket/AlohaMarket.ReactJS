import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, useAuth } from '@/hooks/useApp';
import { authApi } from '@/apis/auth';
import { toast } from 'react-hot-toast';
import { parseToken } from '@/utils/token';
import { hasRole, ROLES } from '@/utils/role';

export default function AuthCallback() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, token } = useAuth();
    const { setUser } = useApp();
    const hasProcessed = useRef(false);
    const toastShown = useRef(false);

    const initializeProfile = useCallback(async () => {
        // Prevent multiple executions
        if (hasProcessed.current) {
            console.log('🔄 AuthCallback: Already processed, skipping...');
            return;
        }

        hasProcessed.current = true; // Mark as processed immediately
        console.log('🔄 AuthCallback: Starting profile initialization...');

        try {
            // The backend will now return the user whether it's new or existing
            const user = await authApi.initUserProfile();
            setUser(user); // Update the user context
            console.log('✅ AuthCallback: Profile initialized successfully');

            // Check if there's a saved redirect path
            const savedRedirectPath = localStorage.getItem('authRedirectPath');
            localStorage.removeItem('authRedirectPath'); // Clean up

            // Check user role and redirect accordingly
            const tokenPayload = parseToken(token || undefined);
            const isAdmin = hasRole(ROLES.ADMIN, tokenPayload);

            console.log('🔄 AuthCallback: User roles:', tokenPayload?.realm_access?.roles || []);
            console.log('🔄 AuthCallback: Is Admin:', isAdmin);
            console.log('🔄 AuthCallback: Saved redirect path:', savedRedirectPath);

            // Show single welcome toast based on user role and redirect
            let welcomeMessage = 'Welcome back!';
            let redirectPath = '/';

            if (savedRedirectPath) {
                // If there's a saved redirect path, use it
                redirectPath = savedRedirectPath;
                welcomeMessage = isAdmin ? 'Welcome back to Admin Console!' : 'Welcome back!';
            } else if (isAdmin) {
                // If admin but no saved path, go to admin console
                redirectPath = '/admin';
                welcomeMessage = 'Welcome to Admin Console!';
            } else {
                // Regular user, go to home page
                redirectPath = '/';
                welcomeMessage = 'Welcome back!';
            }

            // Show toast only once
            if (!toastShown.current) {
                toast.success(welcomeMessage);
                toastShown.current = true;
                console.log('🎉 AuthCallback: Welcome toast shown:', welcomeMessage);
            }

            console.log('🔄 AuthCallback: Navigating to:', redirectPath);
            navigate(redirectPath, { replace: true });
        } catch (error: unknown) {
            console.error('❌ AuthCallback: Failed to initialize profile:', error);
            if (!toastShown.current) {
                toast.error('Failed to setup your account');
                toastShown.current = true;
            }
            navigate('/', { replace: true });
        }
    }, [navigate, setUser, token]);

    useEffect(() => {
        console.log('🔄 AuthCallback useEffect triggered:', {
            isLoading,
            isAuthenticated,
            hasProcessed: hasProcessed.current,
            tokenExists: !!token
        });

        // Prevent multiple executions
        if (hasProcessed.current) {
            console.log('🔄 AuthCallback: Already processed, exiting useEffect...');
            return;
        }

        if (!isLoading && isAuthenticated && !hasProcessed.current) {
            console.log('🔄 AuthCallback: Conditions met, initializing profile...');
            initializeProfile();
        } else if (!isLoading && !isAuthenticated && !hasProcessed.current) {
            console.log('🔄 AuthCallback: Not authenticated, redirecting to home...');
            hasProcessed.current = true;
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, isLoading, initializeProfile, navigate, token]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" />
                <p className="mt-4 text-lg font-medium text-gray-700">
                    Preparing your account...
                </p>
                <p className="text-sm text-gray-500">
                    Please wait a moment.
                </p>
            </div>
        </div>
    );
}
