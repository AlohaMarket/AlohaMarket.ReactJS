import { authApi } from '@/apis/auth';
import { useApp, useAuth } from '@/contexts';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileUpdateModal from '@/components/ProfileUpdateModal';
import ProfileImageUploadModal from '@/components/ProfileImageUploadModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const { user, setUser } = useApp();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUpdateAvatarModalOpen, setIsUpdateAvatarModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'sold', 'favorites'

  // Track if the profile was already fetched
  const hasFetchedProfile = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      login();
      return;
    }

    // Prevent refetching
    if (hasFetchedProfile.current) return;

    const fetchUserProfile = async () => {
      try {
        const response = await authApi.getProfile();
        if (response) {
          setUser(response);
          hasFetchedProfile.current = true;
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, login, setUser]);

  const handleUpdateProfile = () => {
    setIsUpdateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center text-sm mb-4">
        <a href="/" className="text-gray-600 hover:text-yellow-600">
          Aloha Market
        </a>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-800">{t('navigation.profile')}</span>
      </div>

      {/* Main user info header */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          {/* User Avatar */}
          <div className="relative mr-6" onClick={() => setIsUpdateAvatarModalOpen(true)}>
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={t("user_detail.avatar_alt")}
                className="w-24 h-24 rounded-full border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-500">{user?.userName?.charAt(0).toUpperCase() || '?'}</span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-yellow-500 rounded-full p-1 cursor-pointer">
              <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-4 md:mt-0">
            <h1 className="text-2xl font-bold">{user?.userName || t('profile.guest')}</h1>
            <div className="flex items-center mt-1">
              <div className="flex items-center text-yellow-500">
                {'★'.repeat(4)}{'☆'.repeat(1)}
              </div>
              <span className="ml-2 text-gray-500">4.5/5</span>
            </div>
            <div className="flex items-center mt-2 text-gray-500 text-sm">
              <span className="mr-4">
                <span className="font-medium">{t('profile.joined')}:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
              </span>
              <span>
                <span className="font-medium">{t('profile.status')}:</span> {user?.isVerify ? t('profile.verified') : t('profile.notVerified')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Warning - Chotot style */}
      {isAuthenticated && user && !user.isVerify && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
              <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">{t('profile.accountLimited')}</h3>
              <div className="mt-1 text-xs text-yellow-700">
                <p>
                  {t('profile.limitedFunctionality')}
                  <button
                    onClick={handleUpdateProfile}
                    className="ml-2 font-bold text-yellow-800 underline hover:no-underline"
                  >
                    {t('profile.verifyNow')}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-side Layout: 1/3 Profile Info and 2/3 Product Listings */}
      {isAuthenticated ? (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Column - User Profile Info (1/3 width) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">{t('profile.currentInfo')}</h2>
                <button
                  onClick={handleUpdateProfile}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  {t('profile.edit')}
                </button>
              </div>

              {/* User Info Details */}
              <div className="grid gap-4 mb-6">
                <div className="flex border-b border-gray-100 pb-3">
                  <span className="font-medium w-32 text-gray-500">{t('profile.name')}:</span>
                  <span className="text-gray-900">{user?.userName || '-'}</span>
                </div>
                <div className="flex border-b border-gray-100 pb-3">
                  <span className="font-medium w-32 text-gray-500">{t('profile.phone')}:</span>
                  <span className="text-gray-900">{user?.phoneNumber || '-'}</span>
                </div>
              </div>

              {/* User Activity Stats */}
              <div>
                <h3 className="text-md font-medium mb-3">{t('profile.stats')}</h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                    <span className="text-gray-500">{t('profile.listings')}:</span>
                    <span className="font-bold text-yellow-600">0</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                    <span className="text-gray-500">{t('profile.followers')}:</span>
                    <span className="font-bold text-yellow-600">0</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                    <span className="text-gray-500">{t('profile.views')}:</span>
                    <span className="font-bold text-yellow-600">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Listings (2/3 width) */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Tab Navigation - Chotot style */}
              <div className="flex border-b border-gray-100">
                <button
                  className={`flex-1 py-3 text-center font-medium ${activeTab === 'active'
                    ? 'text-yellow-600 border-b-2 border-yellow-500'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('active')}
                >
                  {t('profile.activeListings')}
                </button>
                <button
                  className={`flex-1 py-3 text-center font-medium ${activeTab === 'sold'
                    ? 'text-yellow-600 border-b-2 border-yellow-500'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('sold')}
                >
                  {t('profile.soldItems')}
                </button>
              </div>

              {/* Listings Content */}
              <div className="p-4">
                {activeTab === 'active' && (
                  <div className="text-center py-10">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{t('profile.noActiveListings')}</h3>
                    <p className="text-gray-500 mb-4">{t('profile.startSelling')}</p>
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                      {t('profile.sellNow')}
                    </button>
                  </div>
                )}

                {activeTab === 'sold' && (
                  <div className="text-center py-10">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{t('profile.noSoldItems')}</h3>
                    <p className="text-gray-500">{t('profile.soldItemsDescription')}</p>
                  </div>
                )}

                {activeTab === 'favorites' && (
                  <div className="text-center py-10">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{t('profile.noFavorites')}</h3>
                    <p className="text-gray-500 mb-4">{t('profile.favoritesDescription')}</p>
                    <a href="/" className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                      {t('profile.browseItems')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600 mb-4">{t('profile.loginRequired')}</p>
          <button
            onClick={login}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            {t('auth.login')}
          </button>
        </div>
      )}      <ProfileUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />

      <ProfileImageUploadModal
        isOpen={isUpdateAvatarModalOpen}
        onClose={() => setIsUpdateAvatarModalOpen(false)}
      />
    </div>
  );
}