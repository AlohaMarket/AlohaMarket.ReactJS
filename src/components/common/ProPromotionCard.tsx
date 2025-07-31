import { Crown, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { userPlanApi } from '@/apis/userplan';
import { useApp } from '@/contexts';
import type { UserPlanResponse } from '@/types/userplan.type';

export default function ProPromotionCard() {
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

  const benefits = [
    'Đăng tin không giới hạn',
    'Ưu tiên hiển thị tin đăng',
    'Thống kê chi tiết',
    'Hỗ trợ khách hàng 24/7',
    'Tính năng đẩy tin cao cấp',
    'Quản lý tin đăng nâng cao',
  ];

  // Ẩn card nếu user đã có gói Pro hoặc đang loading
  if (isLoadingPlans || hasActivePlans) return null;

  return (
    <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-amber-50 to-orange-100 p-6 shadow-xl">
      {/* Background decorations */}
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 transform rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20"></div>
      <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 transform rounded-full bg-gradient-to-tr from-amber-400/20 to-yellow-500/20"></div>

      {/* Sparkles animation */}
      <div className="absolute right-4 top-4">
        <Sparkles size={20} className="animate-pulse text-yellow-500" />
      </div>
      <div className="absolute bottom-6 left-6">
        <Sparkles size={16} className="animation-delay-300 animate-pulse text-orange-500" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 p-3">
            <Crown size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Gói PRO</h3>
            <p className="text-sm text-gray-600">Trải nghiệm cao cấp</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-6 space-y-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle size={16} className="flex-shrink-0 text-green-500" />
              <span className="text-sm text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Price tag */}
        <div className="mb-6 rounded-xl border border-orange-200 bg-white p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">Từ 99.000đ</div>
            <div className="text-sm text-gray-500">mỗi tháng</div>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleUpgradeClick}
          className="w-full transform rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-orange-600"
        >
          <div className="flex items-center justify-center gap-2">
            <Crown size={18} />
            <span>{!user ? 'ĐĂNG NHẬP ĐỂ NÂNG CẤP' : 'NÂNG CẤP NGAY'}</span>
            <ArrowRight size={18} />
          </div>
        </Button>

        {/* Small note */}
        <p className="mt-3 text-center text-xs text-gray-500">
          {!user
            ? 'Đăng nhập để trở thành người bán chuyên nghiệp!'
            : 'Tham gia ngay để trở thành người bán chuyên nghiệp!'}
        </p>
      </div>
    </div>
  );
}
