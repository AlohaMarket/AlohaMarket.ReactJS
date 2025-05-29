import { useTranslation } from 'react-i18next';
import BannerSlider from '@/components/common/BannerSlider';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Home, Car, Dog, Monitor, Shirt, Newspaper } from 'lucide-react';
import type { MarketplaceListing } from '@/types';
import { useMarketplaceListings } from '@/hooks/useMarketplaceListings';
const categories = [
  { label: 'Bất động sản', icon: <Home className="w-6 h-6" /> },
  { label: 'Xe cộ', icon: <Car className="w-6 h-6" /> },
  { label: 'Thú cưng', icon: <Dog className="w-6 h-6" /> },
  { label: 'Đồ gia dụng', icon: <Monitor className="w-6 h-6" /> },
  { label: 'Thời trang', icon: <Shirt className="w-6 h-6" /> },
  { label: 'Sách báo', icon: <Newspaper className="w-6 h-6" /> }
];


export default function HomePage() {
  const { t } = useTranslation();

  // Use React Query hook to fetch marketplace listings
  const {
    data: listings = [],
    isLoading,
    error
  } = useMarketplaceListings(8);

  return (
    <div className="min-h-screen">
      {/* Ad Slider Section */}
      <div className="container mx-auto px-6">
        <BannerSlider />

        {/* Shortcut Menu Section */}
        <div className="container mx-auto px-6 mt-8 grid grid-cols-4 md:grid-cols-8 gap-4 text-center">
          {[
            { label: 'Nạp Đồng Tốt', icon: '💰' },
            { label: 'Chợ Tốt Livestream', icon: '📺' },
            { label: 'Gói Pro', icon: '⭐' },
            { label: 'Thu mua ô tô', icon: '🚗' },
            { label: 'Đặt xe chính hãng', icon: '🎁' },
            { label: 'Thu mua xe máy', icon: '🏍️' },
            { label: 'Tin đã lưu', icon: '❤️' },
            { label: 'Đăng tin cho tặng', icon: '🎉' },
          ].map(({ label, icon }) => (
            <div key={label} className="flex flex-col items-center hover:shadow-md p-2 transition">
              <div className="text-3xl">{icon}</div>
              <span className="mt-2 text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">Khám phá danh mục</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {categories.map(({ label }) => (
              <div key={label} className="bg-white rounded-lg p-4 text-center hover:shadow-md transition">
                <div className="mb-2 flex justify-center items-center">
                  {categories.find(cat => cat.label === label)?.icon}
                </div>
                <h3 className="text-sm font-semibold">{label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('product.featured')} {t('navigation.products')}
          </h2>

          {isLoading && (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          )}          {error && (
            <div className="text-center text-red-600 mb-8">
              <p>Error loading listings: {error.message || 'Please try again later.'}</p>
              <p className="text-sm mt-2">
                Check the browser console for more details.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(listings) && listings.map((listing: MarketplaceListing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">                <div className="h-48 bg-gray-200 overflow-hidden">
                {listing.webp_image ? (
                  <img
                    src={listing.webp_image}
                    alt={listing.subject}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://static.vecteezy.com/system/resources/previews/014/814/251/non_2x/a-sale-tag-in-flat-modern-design-vector.jpg';
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {listing.subject || 'No title available'}
                  </h3>
                  <p className="text-gray-600 mb-2 text-sm">
                    {listing.region_name || 'Location not specified'}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-primary-500 font-bold text-xl">
                      {listing.price > 0 ? (
                        new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(listing.price)
                      ) : (
                        'Liên hệ'
                      )}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {listing.date ? new Date(listing.date).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={listing.seller_info.avatar}
                      alt={listing.seller_info.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_1280.png';
                      }}
                    />
                    <span className="text-gray-600 text-sm truncate">
                      {listing.seller_info.full_name}
                    </span>
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