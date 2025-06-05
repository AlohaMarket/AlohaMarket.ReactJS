import { useState } from 'react';
import { useApp, useAuth } from '@/contexts';
import { useTranslation } from 'react-i18next';
import { keycloak } from '@/lib/keycloak';

interface ProfileFormData {
    firstName: string;
    lastName: string;
}

export function ProfileUpdateForm() {
    const { t } = useTranslation();
    const { user } = useApp();

    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Update profile in Keycloak
            await keycloak.updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
            });

            // Force token refresh to get updated user info
            await keycloak.updateToken(-1);

            alert(t('profile.updateSuccess'));
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(t('profile.updateError'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    {t('profile.firstName')}
                </label>
                <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    {t('profile.lastName')}
                </label>
                <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                {t('profile.updateButton')}
            </button>
        </form>
    );
}