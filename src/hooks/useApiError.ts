import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { type ApiError } from '@/types';

export const useApiError = () => {
    const handleError = useCallback((error: ApiError) => {
        // Log error for debugging
        console.error('API Error:', error);

        switch (error.code) {
            case 'VALIDATION_ERROR':
                // Handle validation errors - show individual field errors
                if (error.validationErrors && error.validationErrors.length > 0) {
                    error.validationErrors.forEach(({ field, message }) => {
                        toast.error(`${field}: ${message}`, {
                            duration: 6000,
                        });
                    });
                } else {
                    toast.error(error.message || 'Validation failed');
                }
                break;

            case 'UNAUTHORIZED':
                toast.error('You need to log in to access this resource');
                break;

            case 'FORBIDDEN':
                toast.error('You do not have permission to perform this action');
                break;

            case 'NOT_FOUND':
                toast.error('The requested resource was not found');
                break;

            case 'RATE_LIMIT':
                toast.error('Too many requests. Please try again later');
                break;

            case 'NETWORK_ERROR':
                toast.error('Network error. Please check your internet connection');
                break;

            case 'SERVER_ERROR':
                toast.error('Server error. Please try again later');
                break;

            default:
                toast.error(error.message || 'An unexpected error occurred');
        }

        return error;
    }, []);

    const handleValidationErrors = useCallback((error: ApiError) => {
        const validationErrors: Record<string, string> = {};

        if (error.validationErrors) {
            error.validationErrors.forEach(({ field, message }) => {
                validationErrors[field] = message;
            });
        }

        return validationErrors;
    }, []);

    return {
        handleError,
        handleValidationErrors,
    };
};
