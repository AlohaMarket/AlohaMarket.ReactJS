import { useTranslation } from 'react-i18next';
import { APP_CONFIG } from '@/constants';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to {APP_CONFIG.name}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {APP_CONFIG.description}
            </p>
            <button className="bg-white text-primary-500 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
              {t('common.viewAll')} {t('navigation.products')}
            </button>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t('product.featured')} {t('navigation.products')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Placeholder product cards */}
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Product Image</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">Sample Product {item}</h3>
                    <p className="text-gray-600 mb-2">Product description here...</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-500 font-bold text-xl">$29.99</span>
                      <button className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors">
                        {t('product.addToCart')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t('navigation.categories')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Beauty'].map((category) => (
                <div key={category} className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-500 text-2xl">📱</span>
                  </div>
                  <h3 className="font-semibold">{category}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
  );
} 