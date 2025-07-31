import { useApp, useAuth } from '@/contexts';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileUpdateModal from '@/components/ProfileUpdateModal';
import ProfileImageUploadModal from '@/components/ProfileImageUploadModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const { user } = useApp();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUpdateAvatarModalOpen, setIsUpdateAvatarModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'sold', 'favorites'

  useEffect(() => {
    if (!isAuthenticated) {
      login();
      return;
    }
    // Note: User profile is automatically fetched by useAuth hook, no need to duplicate here
  }, [isAuthenticated, login]);

  const handleUpdateProfile = () => {
    setIsUpdateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-4 flex items-center text-sm">
        <a href="/" className="text-gray-600 hover:text-yellow-600">
          Aloha Market
        </a>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-800">{t('navigation.profile')}</span>
      </div>

      {/* Main user info header */}
      <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex flex-col items-start md:flex-row md:items-center">
          {/* User Avatar */}
          <div className="relative mr-6" onClick={() => setIsUpdateAvatarModalOpen(true)}>
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={t('avatarAlt')}
                className="h-24 w-24 rounded-full border-2 border-gray-200"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                <span className="text-2xl text-gray-500">
                  {user?.userName?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-yellow-500 p-1">
              <svg
                className="h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-4 md:mt-0">
            <h1 className="text-2xl font-bold">{user?.userName || t('guest')}</h1>
            <div className="mt-1 flex items-center">
              <div className="flex items-center text-yellow-500">
                {'★'.repeat(4)}
                {'☆'.repeat(1)}
              </div>
              <span className="ml-2 text-gray-500">4.5/5</span>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="mr-4">
                <span className="font-medium">{t('joined')}:</span>{' '}
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
              </span>
              <span>
                <span className="font-medium">{t('status')}:</span>{' '}
                {user?.isVerify ? t('verified') : t('notVerified')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Warning - Chotot style */}
      {isAuthenticated && user && !user.isVerify && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-full bg-yellow-100 p-2">
              <svg
                className="h-5 w-5 text-yellow-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">{t('accountLimited')}</h3>
              <div className="mt-1 text-xs text-yellow-700">
                <p>
                  {t('limitedFunctionality')}
                  <button
                    onClick={handleUpdateProfile}
                    className="ml-2 font-bold text-yellow-800 underline hover:no-underline"
                  >
                    {t('verifyNow')}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-side Layout: 1/3 Profile Info and 2/3 Product Listings */}
      {isAuthenticated ? (
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Left Column - User Profile Info (1/3 width) */}
          <div className="w-full lg:w-1/3">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium">{t('currentInfo')}</h2>
                <button
                  onClick={handleUpdateProfile}
                  className="flex items-center rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                >
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  {t('edit')}
                </button>
              </div>

              {/* User Info Details */}
              <div className="mb-6 grid gap-4">
                <div className="flex border-b border-gray-100 pb-3">
                  <span className="w-32 font-medium text-gray-500">{t('name')}:</span>
                  <span className="text-gray-900">{user?.userName || '-'}</span>
                </div>
                <div className="flex border-b border-gray-100 pb-3">
                  <span className="w-32 font-medium text-gray-500">{t('phone')}:</span>
                  <span className="text-gray-900">{user?.phoneNumber || '-'}</span>
                </div>
              </div>

              {/* User Activity Stats */}
              <div>
                <h3 className="text-md mb-3 font-medium">{t('stats')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                    <span className="text-gray-500">{t('listings')}:</span>
                    <span className="font-bold text-yellow-600">0</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                    <span className="text-gray-500">{t('followers')}:</span>
                    <span className="font-bold text-yellow-600">0</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                    <span className="text-gray-500">{t('views')}:</span>
                    <span className="font-bold text-yellow-600">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Listings (2/3 width) */}
          <div className="w-full lg:w-2/3">
            <div className="rounded-lg bg-white shadow-sm">
              {/* Tab Navigation - Chotot style */}
              <div className="flex border-b border-gray-100">
                <button
                  className={`flex-1 py-3 text-center font-medium ${activeTab === 'active'
                      ? 'border-b-2 border-yellow-500 text-yellow-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('active')}
                >
                  {t('activeListings')}
                </button>
                <button
                  className={`flex-1 py-3 text-center font-medium ${activeTab === 'sold'
                      ? 'border-b-2 border-yellow-500 text-yellow-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('sold')}
                >
                  {t('soldItems')}
                </button>
              </div>

              {/* Listings Content */}
              <div className="p-4">
                {activeTab === 'active' && (
                  <div className="py-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-1 text-lg font-medium text-gray-900">
                      {t('noActiveListings')}
                    </h3>
                    <p className="mb-4 text-gray-500">{t('startSelling')}</p>
                    <button className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">
                      {t('sellNow')}
                    </button>
                  </div>
                )}

                {activeTab === 'sold' && (
                  <div className="py-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-1 text-lg font-medium text-gray-900">{t('noSoldItems')}</h3>
                    <p className="text-gray-500">{t('soldItemsDescription')}</p>
                  </div>
                )}

                {activeTab === 'favorites' && (
                  <div className="py-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-1 text-lg font-medium text-gray-900">{t('noFavorites')}</h3>
                    <p className="mb-4 text-gray-500">{t('favoritesDescription')}</p>
                    <a
                      href="/"
                      className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                    >
                      {t('browseItems')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-gray-600">{t('loginRequired')}</p>
          <button
            onClick={login}
            className="rounded-lg bg-yellow-500 px-6 py-2 text-white hover:bg-yellow-600"
          >
            {t('auth.login')}
          </button>
        </div>
      )}

      <ProfileUpdateModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} />

      <ProfileImageUploadModal
        isOpen={isUpdateAvatarModalOpen}
        onClose={() => setIsUpdateAvatarModalOpen(false)}
      />
    </div>
  );
}
