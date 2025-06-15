import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/apis/auth';
import { useApp, useAuth } from '@/contexts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProfileUpdatePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, setUser } = useApp();
    const { isAuthenticated, isLoading } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        userName: '',
        phoneNumber: '',
    });
    const [errors, setErrors] = useState({
        phoneNumber: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);

    // Load user data when component mounts
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData({
                userName: user.userName || '',
                phoneNumber: user.phoneNumber || ''
            });
        } else if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, user, navigate, isLoading]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (name === 'phoneNumber') {
            setErrors(prev => ({ ...prev, phoneNumber: '' }));
        }
    };

    const validatePhoneNumber = (phone: string): boolean => {
        const phoneRegex = /^0\d{9}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate phone number
        if (!validatePhoneNumber(formData.phoneNumber)) {
            setErrors(prev => ({
                ...prev,
                phoneNumber: t('validation.phoneNumberFormat')
            }));
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare plain object for updateProfile (no file upload)
            const submitData = {
                userName: formData.userName,
                phoneNumber: formData.phoneNumber,
            };

            const response = await authApi.updateProfile(submitData);

            if (response.data) {
                setUser(response.data);
                toast.success(t('profile.updateSuccess'));

                // If the user wasn't verified before, show verification instructions
                if (!user?.isVerified) {
                    setVerificationSent(true);
                } else {
                    navigate('/profile');
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(t('profile.updateError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">{t('profile.update')}</h1>

            {verificationSent ? (
                <div className="max-w-md mx-auto bg-blue-50 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-blue-800 mb-4">{t('profile.verificationInstructions')}</h2>
                    <p className="mb-4">{t('profile.checkEmail')}</p>
                    <p className="mb-6">{t('profile.verificationNote')}</p>
                    <button
                        onClick={() => navigate('/profile')}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        {t('common.returnToProfile')}
                    </button>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
                    {!user?.isVerified && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('profile.name')}
                            </label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={formData.userName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('profile.phone')}
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="0123456789"
                                className={`w-full px-3 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                required
                            />
                            {errors.phoneNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                {t('profile.phoneFormat')}
                            </p>
                        </div>

                        <div>
                            <label htmlFor="Display Name" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('profile.displayName')}
                            </label>
                            <input
                                type="text"
                                id="Display Name"
                                name="Display Name"
                                value={formData.userName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        {t('common.saving')}
                                    </>
                                ) : (
                                    t('common.save')
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}