import { useTranslation } from 'react-i18next';
import BannerSlider from '@/components/common/BannerSlider';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Home, Car, Dog, Monitor, Shirt, Newspaper, Star, Clock, MapPin, ArrowRight, TrendingUp } from 'lucide-react';
import type { MarketplaceListing } from '@/types';
import { useInfiniteMarketplaceListings } from '@/hooks/useMarketplaceListings';
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

  // Use React Query infinite hook to fetch marketplace listings with pagination
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteMarketplaceListings(8);

  // Flatten all pages data into a single array
  const listings = data?.pages.flat() || [];

  // Skeleton loader component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-5 bg-gray-200 rounded mb-3 w-1/2"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">      {/* Hero Section with Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative">
          <BannerSlider />
        </div>
      </div>      {/* Shortcut Menu Section - Enhanced */}
      <section className="py-8 bg-white/80 backdrop-blur-sm">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 text-center">
            {[
              { label: 'Nạp Đồng Tốt', icon: '💰', color: 'from-yellow-400 to-orange-500' },
              { label: 'Chợ Tốt Livestream', icon: '📺', color: 'from-red-400 to-pink-500' },
              { label: 'Gói Pro', icon: '⭐', color: 'from-purple-400 to-indigo-500' },
              { label: 'Thu mua ô tô', icon: '🚗', color: 'from-blue-400 to-cyan-500' },
              { label: 'Đặt xe chính hãng', icon: '🎁', color: 'from-green-400 to-emerald-500' },
              { label: 'Thu mua xe máy', icon: '🏍️', color: 'from-orange-400 to-red-500' },
              { label: 'Tin đã lưu', icon: '❤️', color: 'from-pink-400 to-rose-500' },
              { label: 'Đăng tin cho tặng', icon: '🎉', color: 'from-indigo-400 to-purple-500' },
            ].map(({ label, icon, color }) => (
              <div key={label} className="group cursor-pointer">
                <div className="flex flex-col items-center hover:scale-105 transition-all duration-300">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <span className="text-2xl filter drop-shadow-sm">{icon}</span>
                  </div>
                  <span className="mt-3 text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300 text-center leading-tight">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* Categories Section - Enhanced */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Khám phá danh mục</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Tìm kiếm sản phẩm theo danh mục phù hợp với nhu cầu của bạn</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {categories.map(({ label, icon }) => (
              <div key={label} className="group cursor-pointer">
                <div className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200">
                  <div className="mb-4 flex justify-center items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                      {icon}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {label}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* Featured Products - Enhanced */}
      <section className="py-20 bg-white">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-16">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              Sản phẩm nổi bật
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('product.featured')} {t('navigation.products')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Khám phá những sản phẩm chất lượng cao được lựa chọn đặc biệt dành cho bạn
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-red-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
                <p className="text-red-600 mb-4">{error.message || 'Vui lòng thử lại sau.'}</p>
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300">
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.isArray(listings) && listings.map((listing: MarketplaceListing) => (
                <div key={listing.id} className="group cursor-pointer">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-[440px] flex flex-col">
                    {/* Image Container */}
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0 relative">
                      {listing.webp_image ? (
                        <img
                          src={listing.webp_image}
                          alt={listing.subject}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://static.vecteezy.com/system/resources/previews/014/814/251/non_2x/a-sale-tag-in-flat-modern-design-vector.jpg';
                          }}
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="text-blue-600 font-medium">Chưa có ảnh</span>
                          </div>
                        </div>
                      )}
                      {/* Price Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-blue-600 font-bold text-sm">
                            {listing.price > 0 ? (
                              new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                                notation: 'compact'
                              }).format(listing.price)
                            ) : (
                              'Liên hệ'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg mb-3 line-clamp-2 min-h-[3.5rem] text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {listing.subject || 'Không có tiêu đề'}
                      </h3>

                      <div className="flex items-center text-gray-500 mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm line-clamp-1">
                          {listing.region_name || 'Chưa xác định vị trí'}
                        </span>
                      </div>

                      {/* Price and Date */}
                      <div className="flex items-center justify-between mb-4 mt-auto">
                        <span className="text-blue-600 font-bold text-xl">
                          {listing.price > 0 ? (
                            new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(listing.price)
                          ) : (
                            'Liên hệ'
                          )}
                        </span>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>
                            {listing.date ? new Date(listing.date).toLocaleDateString('vi-VN') : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Seller Info */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <img
                          src={listing.seller_info.avatar}
                          alt={listing.seller_info.full_name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_1280.png';
                          }}
                        />
                        <div className="flex-grow min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {listing.seller_info.full_name}
                          </p>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500 ml-1">4.8</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </div>))}
            </div>
          )}

          {/* Loading more products indicator */}
          {isFetchingNextPage && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-3 bg-blue-50 text-blue-600 px-6 py-3 rounded-full">
                <LoadingSpinner />
                <span className="font-medium">Đang tải thêm sản phẩm...</span>
              </div>
            </div>
          )}

          {/* View More Button */}
          {!isLoading && !error && listings.length > 0 && (
            <div className="text-center mt-16">
              <button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isFetchingNextPage ? (
                  <div className="flex items-center">
                    <LoadingSpinner />
                    <span className="ml-2">Đang tải...</span>
                  </div>
                ) : hasNextPage ? (
                  <div className="flex items-center">
                    <span>Xem thêm sản phẩm</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                ) : (
                  <span>Đã hết sản phẩm</span>
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}