import { Crown, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userPlanApi } from '@/apis/userplan';
import { useApp } from '@/contexts';
import type { UserPlanResponse } from '@/types/userplan.type';

export default function ProPromotionBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const { user } = useApp();

  // Lấy thông tin gói đăng tin của user
  const { data: userPlans, isLoading: isLoadingPlans } = useQuery<UserPlanResponse[]>({
    queryKey: ['userPlans'],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await userPlanApi.getCurrentUserPlans();
      return response;
    },
    enabled: !!user?.id,
  });

  // Kiểm tra xem user có gói Pro không
  const activePlans = userPlans?.filter((plan: UserPlanResponse) => plan.remainPosts > 0) || [];
  const hasActivePlans = activePlans.length > 0;

  const handleUpgradeClick = () => {
    if (!user) {
      navigate('/required-login');
    } else {
      navigate('/payment/pro');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // Ẩn banner nếu user đã có gói Pro hoặc đang loading
  if (!isVisible || isLoadingPlans || hasActivePlans) return null;

  return (
    <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 px-4 py-3 text-white shadow-lg">
      {/* Animated background */}
      <div className="animate-shimmer absolute inset-0 skew-x-12 transform bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="relative mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Crown size={24} className="animate-bounce text-yellow-200" />
          <div>
            <span className="text-lg font-bold">Nâng cấp lên PRO ngay hôm nay!</span>
            <span className="ml-2 text-sm opacity-90">
              Đăng tin không giới hạn + nhiều tính năng độc quyền
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleUpgradeClick}
            className="flex transform items-center gap-2 rounded-full bg-white px-6 py-2 font-bold text-orange-600 shadow-lg transition-all duration-300 hover:scale-105 hover:text-orange-700"
          >
            <span>{!user ? 'Đăng nhập để nâng cấp' : 'Tìm hiểu thêm'}</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={handleClose}
            className="p-1 text-white transition-colors hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="animate-float animation-delay-0 absolute left-1/4 top-0 h-2 w-2 rounded-full bg-yellow-300"></div>
      <div className="animate-float animation-delay-1000 absolute right-1/3 top-1 h-1.5 w-1.5 rounded-full bg-white"></div>
      <div className="animate-float animation-delay-2000 absolute bottom-1 left-1/2 h-1 w-1 rounded-full bg-yellow-200"></div>
    </div>
  );
}
