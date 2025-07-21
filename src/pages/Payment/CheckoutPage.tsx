import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Crown,
  CreditCard,
  Shield,
  CheckCircle,
  ArrowLeft,
  Wallet,
  Building2,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { paymentAPI, formatPaymentInformation, formatMomoPaymentRequest } from '@/apis/payment';
import { formatPlanPrice, formatPlanDuration } from '@/apis/plan';
import { useApp } from '@/contexts';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  planId: number;
}

export default function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useApp(); // Lấy user từ context
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('vnpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);

  const planId = searchParams.get('planId');
  const planTitle = searchParams.get('title');

  const paymentMethods = [
    {
      id: 'vnpay',
      name: 'VNPay',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Thanh toán qua cổng VNPay (ATM/Visa/Master)',
    },
    {
      id: 'momo',
      name: 'Ví MoMo',
      icon: Wallet,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Thanh toán qua ví điện tử MoMo',
    },
    {
      id: 'banking',
      name: 'Chuyển khoản ngân hàng',
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Chuyển khoản qua Internet Banking',
    },
  ];

  const totalAmount = checkoutItems.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    if (!planId) {
      navigate('/payment/pro');
      return;
    }

    if (!user) {
      navigate(
        '/login?redirectTo=' + encodeURIComponent(window.location.pathname + window.location.search)
      );
      return;
    }

    // Lưu thông tin gói vào localStorage để khôi phục sau redirect
    const planInfo = {
      planId,
      title: planTitle,
      price: searchParams.get('price'),
      duration: searchParams.get('duration'),
      maxPosts: searchParams.get('maxPosts'),
      maxPushes: searchParams.get('maxPushes'),
    };

    localStorage.setItem('payment_plan_info', JSON.stringify(planInfo));

    // Đảm bảo parse an toàn các giá trị number
    const price = parseInt(searchParams.get('price') || '0') || 0;
    const duration = parseInt(searchParams.get('duration') || '0') || 0;
    const maxPosts = parseInt(searchParams.get('maxPosts') || '0') || 0;
    const maxPushes = parseInt(searchParams.get('maxPushes') || '0') || 0;

    console.log('CheckoutPage - User ID:', user.id);
    console.log('CheckoutPage - Plan data:', {
      planId,
      planTitle,
      price,
      duration,
      maxPosts,
      maxPushes,
    });

    const checkoutItem: CheckoutItem = {
      id: `plan-${planId}`,
      name: `${planTitle || 'Gói dịch vụ'} - Gói dịch vụ`,
      price: price,
      duration: formatPlanDuration(duration),
      features: [
        `Đăng tối đa ${maxPosts} tin`,
        `${maxPushes} lần đẩy tin`,
        'Hỗ trợ khách hàng',
        'Thống kê cơ bản',
      ],
      planId: parseInt(planId) || 0,
    };

    setCheckoutItems([checkoutItem]);
    setIsLoading(false);
  }, [planId, planTitle, searchParams, navigate, user]);

  const handlePayment = async () => {
    if (isProcessing || checkoutItems.length === 0 || !user) return;
    setIsProcessing(true);

    try {
      const selectedItem = checkoutItems[0];

      // Nếu là gói FREE (giá = 0), chuyển thẳng đến success page
      if (totalAmount === 0) {
        // Lưu thông tin để success page xử lý
        const freePaymentInfo = {
          planId: String(selectedItem.planId),
          title: String(planTitle || ''),
          price: '0',
          amount: '0',
          status: 'success',
          method: 'free',
          duration: String(searchParams.get('duration') || ''),
          maxPosts: String(searchParams.get('maxPosts') || ''),
          maxPushes: String(searchParams.get('maxPushes') || ''),
        };

        localStorage.setItem('payment_plan_info', JSON.stringify(freePaymentInfo));

        // Chuyển đến success page với params
        const params = new URLSearchParams({
          planId: String(selectedItem.planId),
          title: String(planTitle || ''),
          price: '0',
          amount: '0',
          status: 'success',
          method: 'free',
        });

        navigate(`/payment/success?${params.toString()}`);
        return;
      }

      // Xử lý thanh toán có phí như cũ
      if (selectedPaymentMethod === 'vnpay') {
        const paymentData = formatPaymentInformation(
          selectedItem.planId,
          totalAmount,
          String(planTitle || ''),
          String(user.userName || ''),
          window.location.origin + '/payment/return'
        );

        const paymentResponse = await paymentAPI.createPaymentUrl(paymentData);

        if (!paymentResponse) {
          throw new Error('Không nhận được phản hồi từ server');
        }

        let paymentUrl = paymentResponse.data;

        if (paymentUrl && typeof paymentUrl === 'string') {
          try {
            new URL(paymentUrl); // Validate URL
            await new Promise((resolve) => setTimeout(resolve, 500));
            window.location.href = paymentUrl;
          } catch (urlError) {
            throw new Error('URL thanh toán không hợp lệ');
          }
        } else {
          throw new Error('Không nhận được URL thanh toán từ VNPay');
        }
      } else if (selectedPaymentMethod === 'momo') {
        const momoOrderId = `MOMO_ORDER_${Date.now()}`;
        const momoOrderInfo = `${String(user.userName || '')} Thanh toán ${selectedItem.name} ${totalAmount}`;

        const momoPaymentData = formatMomoPaymentRequest(
          String(user.userName || ''),
          momoOrderId,
          momoOrderInfo,
          totalAmount,
          window.location.origin + '/payment/return'
        );

        const momoResponse = await paymentAPI.createMomoPaymentUrl(momoPaymentData);

        if (momoResponse && momoResponse.data) {
          try {
            new URL(momoResponse.data); // Validate URL
            await new Promise((resolve) => setTimeout(resolve, 500));
            window.location.href = momoResponse.data;
          } catch (urlError) {
            throw new Error('URL thanh toán MoMo không hợp lệ');
          }
        } else {
          throw new Error('Không nhận được URL thanh toán từ MoMo');
        }
      } else {
        setIsProcessing(false);
        return;
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Đã có lỗi xảy ra trong quá trình thanh toán.';
      navigate(`/payment/failed?status=failed&message=${encodeURIComponent(errorMessage)}`);
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return formatPlanPrice(amount);
  };

  const getPaymentMethodLabel = () => {
    const method = paymentMethods.find((m) => m.id === selectedPaymentMethod);
    return method ? method.name : 'Thanh toán ngay';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
              <p className="text-gray-600">Đang tải thông tin gói dịch vụ...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Summary */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Chi tiết đơn hàng</h2>

              {checkoutItems.map((item) => (
                <div
                  key={item.id}
                  className="mb-4 border-b border-gray-200 pb-4 last:mb-0 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                        <Crown className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Thời hạn: {item.duration}</p>
                        <p className="text-sm text-gray-500">Plan ID: {item.planId}</p>
                        <ul className="mt-2 space-y-1">
                          {item.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Phương thức thanh toán</h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`rounded-lg p-2 ${method.bgColor}`}>
                          <Icon className={`h-5 w-5 ${method.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        <div
                          className={`h-4 w-4 rounded-full border-2 ${
                            selectedPaymentMethod === method.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedPaymentMethod === method.id && (
                            <div className="h-full w-full rounded-full bg-white p-0.5">
                              <div className="h-full w-full rounded-full bg-blue-500"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Security Notice */}
            <div className="rounded-lg bg-green-50 p-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Giao dịch được bảo mật</p>
                  <p className="text-sm text-green-700">
                    Thông tin thanh toán của bạn được mã hóa và bảo vệ an toàn
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Total */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Tổng đơn hàng</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí xử lý</span>
                  <span>Miễn phí</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing || checkoutItems.length === 0}
                className="mt-6 w-full bg-orange-500 py-3 text-lg font-semibold text-white hover:bg-orange-600 disabled:bg-gray-400"
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {totalAmount === 0
                      ? 'Đang kích hoạt gói FREE...'
                      : selectedPaymentMethod === 'vnpay'
                        ? 'Đang chuyển hướng sang VNPay...'
                        : selectedPaymentMethod === 'momo'
                          ? 'Đang chuyển hướng sang MoMo...'
                          : 'Đang xử lý...'}
                  </>
                ) : totalAmount === 0 ? (
                  'Kích hoạt gói FREE'
                ) : (
                  `Thanh toán qua ${getPaymentMethodLabel()}`
                )}
              </Button>
            </div>

            {/* Contact Support */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Cần hỗ trợ?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>1900 1234</span>
                </div>
                <p>Hotline hỗ trợ 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
