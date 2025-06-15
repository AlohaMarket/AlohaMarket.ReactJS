/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Crown, Building, Clock, Car, Zap, Phone, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const features = [
    {
      icon: Crown,
      title: 'Quản lý gói dăng sử dụng',
      description: 'Quản lý gói PRO',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      id: 'pro-management',
    },
    {
      icon: Building,
      title: 'Bất động sản',
      description: '',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      id: 'real-estate',
    },
    {
      icon: Clock,
      title: 'Việc làm',
      description: '',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      id: 'jobs',
    },
    {
      icon: Car,
      title: 'Đồ dùng lớ',
      description: '',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      id: 'household-items',
    },
    {
      icon: Zap,
      title: 'Xe máy',
      description: '',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      id: 'motorbike',
    },
    {
      icon: Car,
      title: 'Ô tô',
      description: '',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      id: 'car',
    },
    {
      icon: Zap,
      title: 'Thú cưng',
      description: '',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      id: 'pets',
    },
    {
      icon: Phone,
      title: 'Điện lạnh',
      description: '',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      id: 'electronics',
    },
    {
      icon: Phone,
      title: 'Đồ nội thất',
      description: '',
      color: 'text-teal-500',
      bgColor: 'bg-teal-50',
      id: 'furniture',
    },
  ];

  const handleCategorySelect = (categoryId: string, categoryTitle: string) => {
    setSelectedCategory(categoryId);
    // Có thể thêm animation hoặc feedback visual ở đây
  };

  const handlePurchase = () => {
    if (!selectedCategory) {
      alert('Vui lòng chọn danh mục trước khi mua!');
      return;
    }

    const selectedFeature = features.find((f) => f.id === selectedCategory);
    navigate(
      `/payment/checkout?category=${selectedCategory}&title=${encodeURIComponent(selectedFeature?.title || '')}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-4 text-4xl font-bold text-gray-900">Gói PRO</h1>
              <p className="mb-6 text-lg text-gray-600">
                Là gói dịch vụ dành cho nhà đăng tin chuyên nghiệp, giúp tối ưu chi phí, thời gian
                và hiệu quả đăng tin.
              </p>
            </div>

            {/* Pro Package Selection */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Quản lý gói đăng sử dụng</h3>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>

              <div className="flex items-center space-x-3 rounded-lg border border-purple-200 bg-purple-50 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-purple-700">Quản lý gói PRO</span>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-purple-500" />
              </div>
            </div>

            {/* Features Grid */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Chọn danh mục gói cần mua
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {features.slice(1).map((feature, index) => {
                  const Icon = feature.icon;
                  const isSelected = selectedCategory === feature.id;
                  return (
                    <div
                      key={index}
                      className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                      onClick={() => handleCategorySelect(feature.id, feature.title)}
                    >
                      <div
                        className={`h-8 w-8 ${feature.bgColor} flex items-center justify-center rounded-full`}
                      >
                        <Icon className={`h-4 w-4 ${feature.color}`} />
                      </div>
                      <span className="flex-1 font-medium text-gray-700">{feature.title}</span>
                      {isSelected ? (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      ) : (
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  );
                })}
              </div>

              {selectedCategory && (
                <div className="mt-4 rounded-lg bg-green-50 p-3">
                  <p className="text-sm text-green-700">
                    ✓ Đã chọn:{' '}
                    <strong>{features.find((f) => f.id === selectedCategory)?.title}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Illustration - giữ nguyên */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Background circle */}
              <div className="flex h-80 w-80 items-center justify-center rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300">
                {/* Character illustration */}
                <div className="relative">
                  {/* Person */}
                  <div className="relative h-40 w-32">
                    {/* Head */}
                    <div className="relative mx-auto mb-2 h-16 w-16 overflow-hidden rounded-full bg-orange-200">
                      {/* Hair */}
                      <div className="absolute left-0 top-0 h-8 w-full rounded-t-full bg-gray-800"></div>
                      {/* Face */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transform">
                        {/* Eyes */}
                        <div className="mb-1 flex space-x-2">
                          <div className="h-1 w-1 rounded-full bg-black"></div>
                          <div className="h-1 w-1 rounded-full bg-black"></div>
                        </div>
                        {/* Smile */}
                        <div className="h-1 w-3 rounded-full border-b-2 border-black"></div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="relative mx-auto h-24 w-20 rounded-t-full bg-yellow-400">
                      {/* Arms */}
                      <div className="absolute -left-2 top-4 h-2 w-8 -rotate-12 transform rounded-full bg-orange-200"></div>
                      <div className="absolute -right-2 top-4 h-2 w-8 rotate-12 transform rounded-full bg-orange-200"></div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="absolute -right-8 top-8 h-20 w-12 rotate-12 transform rounded-lg bg-yellow-500 shadow-lg">
                    <div className="h-full w-full rounded-lg bg-gradient-to-b from-orange-400 to-orange-500 p-1">
                      <div className="flex h-full w-full items-center justify-center rounded-md bg-orange-300">
                        <div className="text-xs font-bold text-white">PRO</div>
                      </div>
                    </div>
                    {/* Screen glow effect */}
                    <div className="absolute -inset-1 rounded-lg bg-yellow-400 opacity-30 blur-sm"></div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute left-10 top-10 h-4 w-4 animate-bounce rounded-full bg-orange-400"></div>
              <div className="absolute bottom-10 right-10 h-3 w-3 animate-pulse rounded-full bg-yellow-500"></div>
              <div className="absolute right-5 top-20 h-2 w-2 rounded-full bg-orange-300"></div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Button
            size="lg"
            className={`px-8 py-3 text-lg font-semibold text-white transition-all ${
              selectedCategory
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'cursor-not-allowed bg-gray-400'
            }`}
            onClick={handlePurchase}
            disabled={!selectedCategory}
          >
            {selectedCategory ? 'Mua gói PRO ngay' : 'Chọn danh mục để tiếp tục'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
