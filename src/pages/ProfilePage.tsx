import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('navigation.profile')}</h1>
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">Profile page coming soon...</p>
        </div>
      </div>
  );
} 