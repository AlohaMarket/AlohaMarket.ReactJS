import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BannerSlider from '@/components/common/BannerSlider';
import PostList from '@/components/common/PostList';
import { TrendingUp } from 'lucide-react';
import CategorySection from '@/components/common/CategorySection';
import ProPromotionBanner from '@/components/common/ProPromotionBanner';

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Pro Promotion Banner */}
      <ProPromotionBanner />

      {/* Hero Section with Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative">
          <BannerSlider />
        </div>
      </div>

      {/* Shortcut Menu Section - Enhanced */}
      <section className="bg-white/80 py-8 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-4 gap-4 text-center md:grid-cols-8">
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
                <div className="flex flex-col items-center transition-all duration-300 hover:scale-105">
                  <div
                    className={`rounded-2xl bg-gradient-to-br p-3 ${color} shadow-lg transition-all duration-300 group-hover:shadow-xl`}
                  >
                    <span className="text-2xl drop-shadow-sm filter">{icon}</span>
                  </div>
                  <span className="mt-3 text-center text-xs font-medium leading-tight text-gray-700 transition-colors duration-300 group-hover:text-gray-900">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - Enhanced */}
      <CategorySection />

      {/* Featured Posts - Enhanced */}
      <section className="bg-white py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8 lg:px-16">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
              <TrendingUp className="h-4 w-4" />
              Bài đăng nổi bật
            </div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              {t('product.featured')} Bài đăng
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Khám phá những bài đăng chất lượng cao được lựa chọn đặc biệt dành cho bạn
            </p>
          </div>

          {/* Posts List with Infinite Scroll */}
          <PostList filters={{}} pageSize={8} onPostClick={handlePostClick} />
        </div>
      </section>
    </div>
  );
}
