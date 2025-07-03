import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BannerSlider from '@/components/common/BannerSlider';
import PostList from '@/components/common/PostList';
import { TrendingUp } from 'lucide-react';
import CategorySection from '@/components/common/CategorySection';



export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section with Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative">
          <BannerSlider />
        </div>
      </div>

      {/* Shortcut Menu Section - Enhanced */}
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
      </section>

      {/* Categories Section - Enhanced */}
      <CategorySection />

      {/* Featured Posts - Enhanced */}
      <section className="py-20 bg-white">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-16">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              Bài đăng nổi bật
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('product.featured')} Bài đăng
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Khám phá những bài đăng chất lượng cao được lựa chọn đặc biệt dành cho bạn
            </p>
          </div>

          {/* Posts List with Infinite Scroll */}
          <PostList
            filters={{}}
            pageSize={8}
            onPostClick={handlePostClick}
          />
        </div>
      </section>
    </div>
  );
}