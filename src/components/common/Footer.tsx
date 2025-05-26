import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_CONFIG, SOCIAL_LINKS } from '@/constants';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold">{APP_CONFIG.name}</span>
            </div>
            <p className="text-gray-400 mb-4">{APP_CONFIG.description}</p>
            <div className="text-sm text-gray-400">
              <p>{APP_CONFIG.address}</p>
              <p>{APP_CONFIG.phone}</p>
              <p>{APP_CONFIG.email}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('navigation.home')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  {t('footer.termsOfService')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.customerService')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition-colors">
                  {t('error.contactSupport')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.newsletter')}</h3>
            <p className="text-gray-400 mb-4">{t('footer.subscribeNewsletter')}</p>
            <div className="flex">
              <input
                type="email"
                placeholder={t('footer.enterEmail')}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="bg-primary-500 text-white px-4 py-2 rounded-r-md hover:bg-primary-600 transition-colors">
                {t('footer.subscribe')}
              </button>
            </div>
            
            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">{t('footer.followUs')}</h4>
              <div className="flex space-x-4">
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Twitter
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t('footer.copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
} 