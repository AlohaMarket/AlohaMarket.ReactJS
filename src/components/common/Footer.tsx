import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_CONFIG, SOCIAL_LINKS } from '@/constants';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-700">
      {' '}
      {/* changed from bg-gray-900 text-white */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                <span className="text-lg font-bold text-white">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{APP_CONFIG.name}</span>{' '}
              {/* heading màu xám đậm */}
            </div>
            <p className="mb-4 text-gray-500">{APP_CONFIG.description}</p>
            <div className="text-sm text-gray-500">
              <p>{APP_CONFIG.address}</p>
              <p>{APP_CONFIG.phone}</p>
              <p>{APP_CONFIG.email}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">{t('navigation.home')}</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/about" className="transition-colors hover:text-gray-900">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-gray-900">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition-colors hover:text-gray-900">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition-colors hover:text-gray-900">
                  {t('footer.termsOfService')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {t('footer.customerService')}
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/help" className="transition-colors hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="transition-colors hover:text-gray-900">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="transition-colors hover:text-gray-900">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/support" className="transition-colors hover:text-gray-900">
                  {t('error.contactSupport')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">{t('footer.newsletter')}</h3>
            <p className="mb-4 text-gray-500">{t('footer.subscribeNewsletter')}</p>
            <div className="flex">
              <input
                type="email"
                placeholder={t('footer.enterEmail')}
                className="flex-1 rounded-l-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button className="rounded-r-md bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600">
                {t('footer.subscribe')}
              </button>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-semibold text-gray-900">{t('footer.followUs')}</h4>
              <div className="flex space-x-4">
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Facebook
                </a>
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Twitter
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-gray-500">
          <p>{t('footer.copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
