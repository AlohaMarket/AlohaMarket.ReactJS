/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Crown, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { planAPI, type PlanResponse, formatPlanPrice, formatPlanDuration } from '@/apis/plan';
import { useApp } from '@/contexts';

export default function ProPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const { user } = useApp();

  // React Query - auto cache, refetch on stale
  const {
    data: plans = [] as PlanResponse[],
    isLoading,
    error,
  } = useQuery<PlanResponse[]>({
    queryKey: ['plans'],
    queryFn: async () => {
      console.log('Fetching plans from API...');
      const plansData = await planAPI.getAllPlans();
      console.log('Plans received in queryFn:', plansData);
      // Đảm bảo không filter nếu plansData là undefined hoặc null
      if (!plansData) return [];
      const activePlans = plansData.filter((plan) => plan.isActive !== false); // Coi tất cả gói không có isActive: false là active
      console.log('Active plans after filtering:', activePlans);
      return activePlans;
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    gcTime: 10 * 60 * 1000, // Giữ cache 10 phút (cacheTime đã đổi thành gcTime trong React Query mới)
  });
  console.log(user?.id);

  const handlePlanSelect = (planId: number) => {
    setSelectedPlanId(planId);
  };

  const handlePurchase = () => {
    if (!selectedPlanId) {
      alert('Vui lòng chọn gói dịch vụ trước khi mua!');
      return;
    }

    // Kiểm tra đăng nhập
    if (!user) {
      navigate('/login?redirectTo=' + encodeURIComponent('/payment/pro'));
      return;
    }

    const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
    if (!selectedPlan) return;

    const params = new URLSearchParams({
      planId: selectedPlan.id.toString(),
      title: selectedPlan.name,
      price: selectedPlan.price.toString(),
      duration: selectedPlan.durationDays.toString(),
      maxPosts: selectedPlan.maxPosts.toString(),
      maxPushes: selectedPlan.maxPushes.toString(),
    });

    navigate(`/payment/checkout?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-gray-600">Đang tải gói dịch vụ...</p>
        </div>
      </div>
    );
  }

  // Log để debug
  console.log('Plans state in component:', plans);
  console.log('Error state:', error);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Đã xảy ra lỗi khi tải gói dịch vụ</p>
          <p className="mb-3 text-sm text-red-500">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Không có gói dịch vụ nào khả dụng</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">Chọn Gói Dịch Vụ</h1>
            <p className="text-lg text-gray-600">
              Chọn gói dịch vụ phù hợp để tối ưu hóa hiệu quả đăng tin của bạn
            </p>
          </div>

          {/* Plans Selection */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900">Các gói dịch vụ có sẵn</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${isSelected
                        ? 'scale-105 border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                      }`}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    <div className="text-center">
                      <div className="mb-4 flex justify-center">
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-full ${isSelected ? 'bg-purple-200' : 'bg-purple-100'
                            }`}
                        >
                          <Crown
                            className={`h-8 w-8 ${isSelected ? 'text-purple-700' : 'text-purple-600'
                              }`}
                          />
                        </div>
                      </div>

                      <h4 className="mb-2 text-xl font-bold text-gray-900">{plan.name}</h4>

                      <div className="mb-4 text-3xl font-bold text-purple-600">
                        {formatPlanPrice(plan.price)}
                      </div>

                      <div className="mb-6 space-y-2 text-sm text-gray-600">
                        <p>⏰ {formatPlanDuration(plan.durationDays)}</p>
                        <p>📝 {plan.maxPosts} tin đăng</p>
                        <p>🚀 {plan.maxPushes} lần đẩy tin</p>
                      </div>

                      {isSelected && (
                        <div className="flex justify-center">
                          <CheckCircle className="h-6 w-6 text-purple-500" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedPlanId && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-green-800">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Đã chọn:{' '}
                  <strong className="ml-1">
                    {plans.find((p) => p.id === selectedPlanId)?.name}
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <Button
              size="lg"
              className={`px-12 py-4 text-lg font-semibold text-white transition-all ${selectedPlanId
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : 'cursor-not-allowed bg-gray-400'
                }`}
              onClick={handlePurchase}
              disabled={!selectedPlanId}
            >
              {selectedPlanId ? 'Tiến hành thanh toán' : 'Chọn gói để tiếp tục'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
