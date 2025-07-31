import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { authApi } from '@/apis/auth';
import { useApp } from '@/contexts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProfileUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileUpdateModal({ isOpen, onClose }: ProfileUpdateModalProps) {
    const { t } = useTranslation();
    const { user, setUser } = useApp();

    // Form state
    const [formData, setFormData] = useState({
        userName: '',
        phoneNumber: '',
        birthDay: ''
    });
    const [errors, setErrors] = useState({
        phoneNumber: '',
        birthDay: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);

    // Load user data when modal opens
    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                userName: user.userName || '',
                phoneNumber: user.phoneNumber || '',
                birthDay: user.birthDate || '' // Fixed: correctly access birthDay property
            });
        }
    }, [isOpen, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (name === 'phoneNumber') {
            setErrors(prev => ({ ...prev, phoneNumber: '' }));
        } else if (name === 'birthDay') {
            setErrors(prev => ({ ...prev, birthDay: '' }));
        }
    };

    const validatePhoneNumber = (phone: string): boolean => {
        const phoneRegex = /^0\d{9}$/;
        return phoneRegex.test(phone);
    };

    const validateBirthday = (birthday: string): boolean => {
        if (!birthday) return true; // Optional field

        // Check if it's a valid date
        const date = new Date(birthday);
        if (isNaN(date.getTime())) return false;

        // Check if user is at least 13 years old
        const today = new Date();
        const minAge = 13;
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - minAge);

        return date <= minDate;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let hasError = false;

        // Validate phone number
        if (!validatePhoneNumber(formData.phoneNumber)) {
            setErrors(prev => ({
                ...prev,
                phoneNumber: t('validation.phoneNumberFormat')
            }));
            hasError = true;
        }

        // Validate birthday if provided
        if (formData.birthDay && !validateBirthday(formData.birthDay)) {
            setErrors(prev => ({
                ...prev,
                birthDay: t('validation.birthdayInvalid')
            }));
            hasError = true;
        }

        if (hasError) return;

        setIsSubmitting(true);

        try {
            // Prepare data for update
            const submitData = {
                userName: formData.userName,
                phoneNumber: formData.phoneNumber,
                birthDay: formData.birthDay || undefined
            };

            const response = await authApi.updateProfile(submitData);

            if (response) {
                setUser(response);
                toast.success(t('profile.updateSuccess'));

                // If the user wasn't verified before, show verification sent message
                if (!user?.isVerify) {
                    setVerificationSent(true);
                } else {
                    onClose();
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(t('profile.updateError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // If modal is not open, don't render anything
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {t('profile.update')}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>

                    {verificationSent ? (
                        <div className="text-center py-4">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('profile.verificationInstructions')}</h3>
                            <p className="text-sm text-gray-600 mb-4">{t('profile.checkEmail')}</p>
                            <button
                                onClick={onClose}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {t('common.close')}
                            </button>
                        </div>
                    ) : (
                        <>
                            {!user?.isVerify && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
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

                                {/* Added Birthday Field */}
                                <div>
                                    <label htmlFor="birthDay" className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('profile.birthDay')}
                                    </label>
                                    <input
                                        type="date"
                                        id="birthDay"
                                        name="birthDay"
                                        value={formData.birthDay}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border ${errors.birthDay ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.birthDay && (
                                        <p className="mt-1 text-sm text-red-600">{errors.birthDay}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        {t('profile.birthdayFormat')}
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center">
                                                <LoadingSpinner size="sm" className="mr-2" />
                                                {t('common.saving')}
                                            </div>
                                        ) : (
                                            t('common.save')
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}