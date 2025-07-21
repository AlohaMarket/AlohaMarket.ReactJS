import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  MessageSquare,
  Briefcase,
  MapPin,
  ChevronDown,
  User,
  Grid,
  LogOut,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useApp, useAuth } from '@/contexts';
import { LocationModal } from './LocationModal';
import { LocationType } from '@/types/location.type';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/constants';
import toast from 'react-hot-toast';
import ProUpgradeButton from './ProUpgradeButton';

export default function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, changeLanguage } = useApp();
  const [selectedAddress, setSelectedAddress] = useState('Toàn Quốc');
  const [selectedLocationId, setSelectedLocationId] = useState<number>(0);
  const [selectedLocationLevel, setSelectedLocationLevel] = useState<LocationType>(
    LocationType.PROVINCE
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const { isAuthenticated, login, logout, register } = useAuth();
  const { user } = useApp();
  const { user: authUser } = useAuth();

  const handleSelectLocation = (
    locationId: number,
    locationLevel: LocationType,
    displayText: string
  ) => {
    setSelectedLocationId(locationId);
    setSelectedLocationLevel(locationLevel);
    setSelectedAddress(displayText);
    setShowLocationModal(false);
  };

  const handleCreatePost = () => {
    if (user?.isVerify) {
      navigate('/create-post');
    } else {
      toast.error(t('header.createPost.verifyRequired'));
    }
  };

  const handleSearch = () => {
    // Navigate to post list page with search params
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set('searchTerm', searchTerm.trim());
    }

    if (selectedLocationId > 0) {
      params.set('locationId', selectedLocationId.toString());
      params.set('locationLevel', selectedLocationLevel);
    }

    const queryString = params.toString();
    navigate(`/posts${queryString ? `?${queryString}` : ''}`);
  };

  // Add language switcher in the top navigation
  const renderLanguageSelector = () => (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value as 'en' | 'vi')}
        className="cursor-pointer bg-transparent text-sm text-white"
      >
        {LANGUAGES.map(({ code, flag }) => (
          <option key={code} value={code} className="text-black">
            {flag}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <header className="bg-blue-600 text-white">
      {/* Top navigation bar */}
      <div className="flex items-center justify-between border-b border-blue-800 bg-blue-700 px-4 py-2 text-sm text-white">
        <div className="flex space-x-6">
          {renderLanguageSelector()}
          {['Chợ Tốt', 'Nhà Tốt', 'Chợ Tốt Xe', 'Việc Làm Tốt'].map((label) => (
            <a key={label} href="#" className="transition hover:text-gray-200">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          {[
            { label: 'Đóng góp ý kiến', href: 'feedback' },
            { label: 'Tải ứng dụng', href: 'download-app' },
            { label: 'Trợ giúp', href: 'help' },
          ].map(({ label, href }) => (
            <a key={label} href={href} className="transition hover:text-gray-200">
              {label}
            </a>
          ))}
          <a
            href="/seller"
            className="flex cursor-pointer items-center space-x-1 rounded bg-blue-600 px-2 py-1 transition hover:bg-blue-500"
          >
            <Briefcase size={16} className="text-white" />
            <span className="text-xs font-medium">Dành cho người bán</span>
            <ChevronDown size={16} className="text-white" />
          </a>
        </div>
      </div>

      {/* Main header bar */}
      <div className="flex items-center justify-between bg-blue-600 px-4 py-3">
        <div className="flex flex-grow items-center gap-4">
          {/* Logo */}
          <div
            className="flex items-center justify-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src="/src/assets/imgs/logo.png"
              alt="Aloha Market Logo"
              className="h-12 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>

          {/* Search and Address */}
          <div className="min-w-6xl relative flex-grow">
            <div className="flex items-center overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
              <div className="flex flex-1 items-center justify-between rounded-lg bg-white px-4 py-2 shadow-lg">
                <div
                  className="relative flex cursor-pointer items-center space-x-2 border-r border-gray-200 pr-4"
                  onClick={() => setShowLocationModal(true)}
                >
                  <MapPin size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{selectedAddress}</span>
                  <ChevronDown size={16} className="text-gray-600" />
                </div>
                <Input
                  className="flex-1 border-none bg-white px-4 py-2 text-gray-800 placeholder-gray-400 focus:ring-0"
                  placeholder="Tìm kiếm trên Chợ Tốt Xe"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                <button
                  className="flex items-center justify-center bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600"
                  onClick={handleSearch}
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side icons and account */}
        <div className="ml-4 flex items-center gap-4">
          {/* Pro Upgrade Button */}
          <ProUpgradeButton />

          <Bell size={20} className="cursor-pointer text-white transition hover:text-gray-200" />

          <div className="relative">
            <MessageSquare
              size={20}
              className="cursor-pointer text-white transition hover:text-gray-200"
              onClick={() => navigate('/chat')}
            />
          </div>

          <Briefcase
            size={20}
            className="cursor-pointer text-white transition hover:text-gray-200"
          />

          {/* Account dropdown */}
          <div className="relative">
            <div
              className="flex cursor-pointer items-center gap-1 transition hover:text-gray-200"
              onClick={() => setShowAccount(!showAccount)}
            >
              <User size={20} />
              {isAuthenticated ? (
                <span className="text-sm">{user?.userName}</span>
              ) : authUser ? (
                <span className="text-sm">{authUser.email}</span>
              ) : (
                <span className="text-sm">Tài khoản</span>
              )}
              <ChevronDown size={16} />
            </div>

            {showAccount && (
              <div className="animate-fadeIn absolute right-0 top-full z-20 mt-2 w-64 rounded bg-white text-gray-800 shadow-lg">
                {isAuthenticated ? (
                  <>
                    <div className="border-b border-gray-200 p-3">
                      <div className="flex items-center gap-2 px-2 py-1">
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                          {user?.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.userName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User size={20} className="h-full w-full p-1 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{user?.userName}</div>
                          <div className="text-xs text-gray-500">{authUser?.email}</div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-gray-800 transition hover:bg-orange-100 hover:text-orange-600"
                      onClick={() => navigate('/profile')}
                    >
                      <User size={16} />
                      <span>Trang cá nhân</span>
                    </div>
                    <div
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-gray-800 transition hover:bg-orange-100 hover:text-orange-600"
                      onClick={() => navigate('/my-posts')}
                    >
                      <Grid size={16} />
                      <span>Tin đăng của tôi</span>
                    </div>
                    <div
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-red-500 transition hover:bg-red-50"
                      onClick={() => {
                        logout();
                        setShowAccount(false);
                      }}
                    >
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="cursor-pointer rounded px-2 py-2 font-medium text-gray-800 transition hover:bg-orange-100 hover:text-orange-600"
                      onClick={() => {
                        login();
                        setShowAccount(false);
                      }}
                    >
                      Đăng nhập
                    </div>
                    <div
                      className="cursor-pointer rounded px-2 py-2 font-medium text-gray-800 transition hover:bg-orange-100 hover:text-orange-600"
                      onClick={() => {
                        register();
                        setShowAccount(false);
                      }}
                    >
                      Đăng ký
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {isAuthenticated && (
            <Button
              className="rounded-lg bg-orange-500 px-4 py-2 font-bold text-white shadow-lg transition hover:bg-orange-600"
              onClick={() => handleCreatePost()}
            >
              <span className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14m7-7H5" />
                </svg>
                ĐĂNG TIN
              </span>
            </Button>
          )}
        </div>
      </div>

      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={handleSelectLocation}
      />
    </header>
  );
}
