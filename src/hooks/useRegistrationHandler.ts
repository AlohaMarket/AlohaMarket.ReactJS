import { useCallback, useEffect, useRef, useState } from 'react';
import { authApi } from '@/apis/auth';

interface UseRegistrationHandlerOptions {
    isAuthenticated: boolean;
    isLoading: boolean;
    isRegistrationFlow: boolean;
    onSuccess: () => void;
    onError: (message: string) => void;
}

export function useRegistrationHandler({
    isAuthenticated,
    isLoading,
    isRegistrationFlow,
    onSuccess,
    onError
}: UseRegistrationHandlerOptions) {
    const [registering, setRegistering] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 5;
    const registrationAttemptedRef = useRef(false);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearSession = useCallback(() => {
        sessionStorage.removeItem('registrationId');
        registrationAttemptedRef.current = false;
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
        }
    }, []);

    const resetRetry = useCallback(() => {
        setRetryCount(0);
    }, []);

    const registerUserProfile = useCallback(async () => {
        if (!isAuthenticated || registering || !isRegistrationFlow) return;
        if (registrationAttemptedRef.current) return;
        registrationAttemptedRef.current = true;

        const existingId = sessionStorage.getItem('registrationId');
        if (existingId) return;

        const newRegistrationId = Date.now().toString();
        sessionStorage.setItem('registrationId', newRegistrationId);

        try {
            setRegistering(true);
            await new Promise(resolve => setTimeout(resolve, 100));

            const currentId = sessionStorage.getItem('registrationId');
            if (currentId !== newRegistrationId) return;

            await authApi.initUserProfile();
            clearSession();
            onSuccess();
        } catch (err) {
            clearSession();
            onError('Account setup failed. Please try again.');
        } finally {
            setRegistering(false);
        }
    }, [isAuthenticated, registering, isRegistrationFlow, onSuccess, onError, clearSession]);

    useEffect(() => {
        if (retryCount >= MAX_RETRIES) {
            onError(`Couldn't complete your registration after ${MAX_RETRIES} attempts. Please try again.`);
            return;
        }

        if (isRegistrationFlow) {
            if (isAuthenticated && !isLoading) {
                registerUserProfile();
            } else {
                const delay = Math.pow(2, retryCount) * 1000;
                retryTimeoutRef.current = setTimeout(() => setRetryCount(prev => prev + 1), delay);
            }
        }

        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
        };
    }, [retryCount, isAuthenticated, isLoading, isRegistrationFlow, registerUserProfile, onError]);

    return {
        registering,
        retryCount,
        MAX_RETRIES,
        resetRetry,
        clearSession
    };
}
