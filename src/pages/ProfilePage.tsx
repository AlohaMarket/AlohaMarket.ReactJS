import { useApp, useAuth } from '@/contexts';
import { useTranslation } from 'react-i18next';
import { ProfileUpdateForm } from '@/components/ProfileUpdateForm';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { logout, login, isAuthenticated, isLoading } = useAuth();
  const { user } = useApp();

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('navigation.profile')}</h1>

      {isAuthenticated ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">{t('profile.currentInfo')}</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {user?.name}</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{t('profile.updateProfile')}</h2>
            <ProfileUpdateForm />
          </div>

          <button
            onClick={logout}
            className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            {t('auth.logout')}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={login}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {t('auth.login')}
          </button>
        </div>
      )}
    </div>
  );
}