// AuthStatusHandler.tsx
import { useAuth } from '@/hooks/useApp';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useRegistrationHandler } from '@/hooks/useRegistrationHandler';

export default function AuthStatusHandler() {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [registerError, setRegisterError] = useState<string | null>(null);

    const isRegistrationFlow = location.pathname === '/after-register';

    const {
        registering,
        retryCount,
        MAX_RETRIES,
        resetRetry,
        clearSession
    } = useRegistrationHandler({
        isAuthenticated,
        isLoading,
        isRegistrationFlow,
        onSuccess: () => {
            toast.success('Account setup complete!');
            navigate('/', { replace: true });
        },
        onError: (msg) => {
            toast.error(msg);
            setRegisterError(msg);
        }
    });

    // Navigate home on normal login (non-registration flow)
    useEffect(() => {
        if (!isRegistrationFlow && isAuthenticated && !isLoading) {
            navigate('/', { replace: true });
        }
    }, [isRegistrationFlow, isAuthenticated, isLoading, location.pathname, navigate]);

    // Cleanup on route change
    useEffect(() => {
        return () => {
            if (!isRegistrationFlow) {
                clearSession();
            }
        };
    }, [isRegistrationFlow, clearSession]);

    const handleTryAgain = () => {
        clearSession();
        setRegisterError(null);
        resetRetry();
    };

    if (isLoading || registering) {
        return <RegistrationLoadingUI registering={registering} retryCount={retryCount} max={MAX_RETRIES} />;
    }

    if (registerError) {
        return <RegistrationErrorUI
            retryCount={retryCount}
            max={MAX_RETRIES}
            error={registerError}
            onTryAgain={handleTryAgain}
            onHome={() => navigate('/', { replace: true })}
        />;
    }

    if (isRegistrationFlow && retryCount > 0 && retryCount < MAX_RETRIES) {
        return <RegistrationLoadingUI registering={false} retryCount={retryCount} max={MAX_RETRIES} />;
    }

    return null;
}

function RegistrationLoadingUI({ registering, retryCount, max }: { registering: boolean; retryCount: number; max: number }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-lg font-medium text-gray-700">
                    {registering ? 'Setting up your account...' : 'Authenticating...'}
                </p>
                <p className="text-sm text-gray-500">
                    {registering ? 'Please wait while we prepare your account.' : 'Please wait...'}
                </p>
                {retryCount > 0 && !registering && (
                    <p className="mt-2 text-xs text-amber-600">Retry attempt {retryCount} of {max}...</p>
                )}
            </div>
        </div>
    );
}

function RegistrationErrorUI({ error, retryCount, max, onTryAgain, onHome }: {
    error: string;
    retryCount: number;
    max: number;
    onTryAgain: () => void;
    onHome: () => void;
}) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
                <div className="text-red-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Registration Error</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                {retryCount >= max && (
                    <p className="text-amber-600 text-sm mb-4">
                        We tried {max} times but couldn't complete your registration.
                        This could be due to a temporary issue with our authentication service.
                    </p>
                )}
                <div className="flex justify-center space-x-4">
                    <button onClick={onHome} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        Go to Homepage
                    </button>
                    <button onClick={onTryAgain} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
}
