import { useTranslation } from 'react-i18next';
import BannerSlider from '@/components/common/BannerSlider';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Ad Slider Section */}
      <div className="container mx-auto px-6">
        <BannerSlider />
      </div>
      

      {/* Categories Section - This was moved below the ad slider */}
      <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
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

      {/* Featured Products */}
      <section className="py-16">
      <div className="container mx-auto px-6">
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
    </div>
  );
}