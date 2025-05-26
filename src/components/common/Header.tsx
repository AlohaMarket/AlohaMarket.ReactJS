import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_CONFIG } from '@/constants';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>{t('footer.followUs')}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="hover:text-primary-500">
              {t('navigation.login')}
            </Link>
            <span>|</span>
            <Link to="/register" className="hover:text-primary-500">
              {t('navigation.register')}
            </Link>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{APP_CONFIG.name}</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder={t('search.searchProducts')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 text-white px-4 py-1 rounded-md hover:bg-primary-600">
                {t('common.search')}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link to="/cart" className="flex items-center space-x-1 hover:text-primary-500">
              <span>{t('navigation.cart')}</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-1 hover:text-primary-500">
              <span>{t('navigation.account')}</span>
            </Link>
          </nav>
        </div>

        {/* Navigation menu */}
        <nav className="flex items-center space-x-8 py-3 border-t">
          <Link to="/" className="text-gray-700 hover:text-primary-500 font-medium">
            {t('navigation.home')}
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-primary-500 font-medium">
            {t('navigation.products')}
          </Link>
          <Link to="/categories" className="text-gray-700 hover:text-primary-500 font-medium">
            {t('navigation.categories')}
          </Link>
        </nav>
      </div>
    </header>
  );
} 