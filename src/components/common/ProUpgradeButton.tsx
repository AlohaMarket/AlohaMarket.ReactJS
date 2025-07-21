import { Crown, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { userPlanApi } from '@/apis/userplan';
import { useApp } from '@/contexts';
import type { UserPlanResponse } from '@/types/userplan.type';

export default function ProUpgradeButton() {
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
    enabled: !!user?.id, // Chỉ query khi có user
  });

  // Kiểm tra xem user có gói Pro không
  const activePlans = userPlans?.filter((plan: UserPlanResponse) => plan.remainPosts > 0) || [];
  const hasActivePlans = activePlans.length > 0;

  const handleUpgradeClick = () => {
    if (hasActivePlans) {
      // Nếu đã có gói Pro, chuyển đến trang quản lý gói
      navigate('/my-plans');
    } else {
      // Nếu chưa có gói Pro, chuyển đến trang mua gói
      navigate('/payment/pro');
    }
  };

  // Nếu đang loading
  if (isLoadingPlans) {
    return (
      <Button
        disabled
        className="group relative transform overflow-hidden rounded-lg bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 px-4 py-2 font-bold text-white shadow-lg"
      >
        <div className="relative flex items-center gap-2">
          <Crown size={18} className="text-gray-200" />
          <span className="text-sm font-bold tracking-wide">ĐANG TẢI...</span>
        </div>
      </Button>
    );
  }

  // Nếu không có user (chưa đăng nhập)
  if (!user) {
    return (
      <Button
        onClick={() => navigate('/required-login')}
        className="group relative transform overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 px-4 py-2 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600 hover:shadow-xl"
      >
        <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>

        <div className="relative flex items-center gap-2">
          <Crown
            size={18}
            className="text-yellow-200 transition-colors group-hover:text-yellow-100"
          />
          <span className="text-sm font-bold tracking-wide">NÂNG CẤP PRO</span>
          <Sparkles
            size={16}
            className="animate-pulse text-yellow-200 transition-colors group-hover:text-yellow-100"
          />
        </div>

        <div className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-red-500"></div>
        <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-600"></div>
      </Button>
    );
  }

  // Nếu đã có gói Pro
  if (hasActivePlans) {
    return (
      <Button
        onClick={handleUpgradeClick}
        className="group relative transform overflow-hidden rounded-lg bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-4 py-2 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 hover:shadow-xl"
      >
        <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>

        <div className="relative flex items-center gap-2">
          <CheckCircle
            size={18}
            className="text-green-200 transition-colors group-hover:text-green-100"
          />
          <span className="text-sm font-bold tracking-wide">THÀNH VIÊN PRO</span>
          <Crown
            size={16}
            className="text-green-200 transition-colors group-hover:text-green-100"
          />
        </div>

        <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
      </Button>
    );
  }

  // Nếu chưa có gói Pro
  return (
    <Button
      onClick={handleUpgradeClick}
      className="group relative transform overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 px-4 py-2 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600 hover:shadow-xl"
    >
      <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>

      <div className="relative flex items-center gap-2">
        <Crown
          size={18}
          className="text-yellow-200 transition-colors group-hover:text-yellow-100"
        />
        <span className="text-sm font-bold tracking-wide">NÂNG CẤP PRO</span>
        <Sparkles
          size={16}
          className="animate-pulse text-yellow-200 transition-colors group-hover:text-yellow-100"
        />
      </div>

      <div className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-red-500"></div>
      <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-600"></div>
    </Button>
  );
}
