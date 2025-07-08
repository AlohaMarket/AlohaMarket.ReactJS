import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, useAuth } from '@/hooks/useApp';
import { authApi } from '@/apis/auth';
import { toast } from 'react-hot-toast';

export default function AuthCallback() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();
    const { setUser } = useApp();

    useEffect(() => {
        const initializeProfile = async () => {
            try {
                // The backend will now return the user whether it's new or existing
                const user = await authApi.initUserProfile();
                setUser(user); // Update the user context
                toast.success('Welcome back!');
            } catch (error: unknown) {
                console.error('Failed to initialize profile:', error);
                toast.error('Failed to setup your account');
            } finally {
                navigate('/', { replace: true });
            }
        };

        if (!isLoading && isAuthenticated) {
            initializeProfile();
        } else if (!isLoading && !isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate, setUser]);

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
