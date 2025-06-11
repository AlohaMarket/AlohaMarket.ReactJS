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

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

export default function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('momo');
  const [isProcessing, setIsProcessing] = useState(false);

  // Lấy thông tin danh mục từ URL params
  const categoryId = searchParams.get('category');
  const categoryTitle = searchParams.get('title');

  const [checkoutItems] = useState<CheckoutItem[]>([
    {
      id: categoryId || 'pro-monthly',
      name: `Gói PRO - ${categoryTitle || 'Không xác định'}`,
      price: 299000,
      duration: '30 ngày',
      features: [
        'Đăng tin không giới hạn',
        'Tin được ưu tiên hiển thị',
        'Hỗ trợ khách hàng VIP',
        'Thống kê chi tiết',
      ],
    },
  ]);

  const paymentMethods = [
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
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Chuyển khoản qua Internet Banking',
    },
    {
      id: 'card',
      name: 'Thẻ tín dụng/ghi nợ',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Visa, Mastercard, JCB',
    },
    {
      id: 'atm',
      name: 'Thẻ ATM nội địa',
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Thẻ ATM các ngân hàng Việt Nam',
    },
  ];

  const totalAmount = checkoutItems.reduce((sum, item) => sum + item.price, 0);

  // Redirect về ProPage nếu không có thông tin danh mục
  useEffect(() => {
    if (!categoryId || !categoryTitle) {
      navigate('/payment/pro');
    }
  }, [categoryId, categoryTitle, navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate third-party payment gateway integration
      // Trong thực tế, đây sẽ là API call tới payment gateway
      const paymentData = {
        orderId: 'ORDER_' + Date.now(),
        amount: totalAmount,
        method: selectedPaymentMethod,
        category: categoryId,
        categoryTitle: categoryTitle,
        returnUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/failed`,
      };

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate

      if (isSuccess) {
        // Redirect to success page
        navigate('/payment/success', {
          state: {
            ...paymentData,
            status: 'success',
            transactionId: 'TXN_' + Date.now(),
          },
        });
      } else {
        // Redirect to failed page
        navigate('/payment/failed', {
          state: {
            ...paymentData,
            status: 'failed',
            error: 'Giao dịch không thành công',
          },
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      navigate('/payment/failed', {
        state: {
          status: 'failed',
          error: 'Có lỗi xảy ra trong quá trình thanh toán',
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

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
                disabled={isProcessing}
                className="mt-6 w-full bg-orange-500 py-3 text-lg font-semibold text-white hover:bg-orange-600 disabled:bg-gray-400"
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Đang xử lý...
                  </>
                ) : (
                  'Thanh toán ngay'
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
