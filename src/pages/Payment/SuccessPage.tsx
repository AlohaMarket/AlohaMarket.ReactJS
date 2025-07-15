import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Crown, ArrowRight, Download, Home, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { paymentAPI } from '@/apis/payment';
import { useApp } from '@/contexts';

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setUser } = useApp(); // Lấy user từ context
  const [price, setPrice] = useState<number>(0);
  const [status, setStatus] = useState<'success' | 'failed'>('failed');
  const [orderId, setOrderId] = useState<string>('N/A');
  const [planTitle, setPlanTitle] = useState<string>('Gói dịch vụ');
  // Lưu thời gian thanh toán khi component được khởi tạo
  const [paymentTime] = useState<string>(new Date().toISOString());

  useEffect(() => {
    let planId = searchParams.get('planId');
    let title = searchParams.get('title');
    let priceParam = parseInt(searchParams.get('amount') || searchParams.get('price') || '0');
    const statusParam = searchParams.get('status') || 'success';

    // Nếu không có planId hoặc title trong URL, thử lấy từ localStorage
    if (!planId || !title || !priceParam) {
      const savedPlan = localStorage.getItem('payment_plan_info');
      if (savedPlan) {
        try {
          const planData = JSON.parse(savedPlan);
          if (!planId && planData.planId) planId = planData.planId;
          if (!title && planData.title) title = planData.title;
          if (!priceParam && planData.price) priceParam = parseInt(planData.price);
        } catch (e) {
          console.error('Không thể parse thông tin gói từ localStorage', e);
        }
      }
    }

    // Đặt giá trị mặc định nếu vẫn không tìm thấy
    planId = planId || '1';
    title = title || 'Gói dịch vụ';
    priceParam = priceParam || 0;

    setPrice(priceParam);
    setStatus(statusParam === 'success' ? 'success' : 'failed');

    // Nếu có title thì dùng
    if (title) {
      setPlanTitle(title);
    }

    // Kiểm tra user và status trước khi tạo đơn hàng
    if (statusParam === 'success' && user?.id) {
      const createOrder = async () => {
        try {
          console.log('Tạo đơn hàng với:', {
            userId: user.id,
            planId,
            price: priceParam,
            // Backend sẽ tự đặt CreatedAt = DateTime.UtcNow
          });

          const response = await paymentAPI.createOrder({
            userId: user.id,
            planId,
            price: priceParam,
          });

          // Lấy orderId từ response
          if (response?.id) {
            setOrderId(response.id);
          }
        } catch (error) {
          console.error('Lỗi khi tạo đơn hàng:', error);
        }
      };

      createOrder();
    }

    // Xóa dữ liệu payment_plan_info sau khi đã xử lý xong
    setTimeout(() => {
      localStorage.removeItem('payment_plan_info');
    }, 5000);
  }, [searchParams, user, navigate]);

  // Trong useEffect xử lý user
  useEffect(() => {
    // Nếu không có user, thử đọc từ localStorage
    if (!user) {
      const userProfile = localStorage.getItem('user_profile');
      if (userProfile) {
        try {
          const userData = JSON.parse(userProfile);
          setUser({
            id: userData.sub,
            email: userData.email || '',
            name: userData.name || '',
            userName: userData.preferred_username || '',
            role: userData.role || 'user',
          });
        } catch (parseError) {
          console.error('Lỗi parse user data', parseError);
          navigate(
            '/login?redirectTo=' +
              encodeURIComponent(window.location.pathname + window.location.search)
          );
        }
      } else {
        navigate(
          '/login?redirectTo=' +
            encodeURIComponent(window.location.pathname + window.location.search)
        );
      }
    }
  }, [user, navigate, setUser]);

  const isSuccess = status === 'success';

  // Nếu chưa có user, chuyển hướng đến trang login
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-gray-600">Đang xác thực người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          {/* Success/Failed Status */}
          <div className="mb-8 text-center">
            <div
              className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
                isSuccess ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <XCircle className="h-12 w-12 text-red-500" />
              )}
            </div>

            <h1
              className={`mb-4 text-3xl font-bold ${isSuccess ? 'text-green-700' : 'text-red-700'}`}
            >
              {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
            </h1>

            <p className="text-lg text-gray-600">
              {isSuccess
                ? `${planTitle} đã được kích hoạt thành công`
                : 'Đã có lỗi xảy ra trong quá trình thanh toán'}
            </p>
          </div>

          {/* Payment Details */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Chi tiết giao dịch</h2>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-medium text-gray-900">{orderId}</span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-gray-600">Khách hàng:</span>
                <span className="font-medium text-gray-900">{user.userName || 'N/A'}</span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-gray-600">Gói dịch vụ:</span>
                <span className="font-medium text-gray-900">{planTitle}</span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-medium text-gray-900">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(price)}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-gray-600">Phương thức:</span>
                <span className="font-medium capitalize text-gray-900">
                  {searchParams.get('method') || 'VNPay'}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-medium text-gray-900">
                  {new Date(paymentTime).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>

          {isSuccess ? (
            /* Success Actions */
            <>
              <div className="mb-6 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-6">
                <div className="mb-4 flex items-center">
                  <Crown className="mr-3 h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quyền lợi {planTitle} của bạn
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    'Đăng tin không giới hạn',
                    'Tin được ưu tiên hiển thị',
                    'Hỗ trợ khách hàng VIP',
                    'Thống kê chi tiết',
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Button
                  onClick={() => navigate('/')}
                  className="bg-orange-500 py-3 text-white hover:bg-orange-600"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Về trang chủ
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    const receiptData = {
                      orderId: orderId,
                      userId: user.id,
                      userName: user.userName || 'N/A',
                      planTitle: planTitle,
                      amount: price,
                      method: searchParams.get('method') || 'vnpay',
                      status: status,
                      timestamp: paymentTime, // Sử dụng thời gian đã lưu khi component được khởi tạo
                    };

                    const dataStr = JSON.stringify(receiptData, null, 2);
                    const dataUri =
                      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                    const exportFileDefaultName = `receipt_${orderId}.json`;

                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                  }}
                  className="py-3"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Tải biên lai
                </Button>
              </div>
            </>
          ) : (
            /* Failed Actions */
            <div className="space-y-4">
              <div className="rounded-lg bg-red-50 p-6">
                <div className="mb-3 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-800">Gợi ý xử lý</h3>
                </div>

                <ul className="space-y-2 text-red-700">
                  <li>• Kiểm tra lại thông tin tài khoản thanh toán</li>
                  <li>• Đảm bảo tài khoản có đủ số dư</li>
                  <li>• Thử lại với phương thức thanh toán khác</li>
                  <li>• Liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Button
                  onClick={() => {
                    // Quay lại checkout với các params tương tự
                    const planId = searchParams.get('planId');
                    const title = searchParams.get('title');
                    const price = searchParams.get('price');
                    const duration = searchParams.get('duration');
                    const maxPosts = searchParams.get('maxPosts');
                    const maxPushes = searchParams.get('maxPushes');

                    const params = new URLSearchParams();
                    if (planId) params.set('planId', planId);
                    if (title) params.set('title', title);
                    if (price) params.set('price', price);
                    if (duration) params.set('duration', duration);
                    if (maxPosts) params.set('maxPosts', maxPosts);
                    if (maxPushes) params.set('maxPushes', maxPushes);

                    navigate(`/payment/checkout?${params.toString()}`);
                  }}
                  className="bg-orange-500 py-3 text-white hover:bg-orange-600"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Thử lại
                </Button>

                <Button variant="outline" onClick={() => navigate('/')} className="py-3">
                  <Home className="mr-2 h-4 w-4" />
                  Về trang chủ
                </Button>
              </div>
            </div>
          )}

          {/* Support Contact */}
          <div className="mt-8 rounded-lg bg-gray-100 p-4 text-center">
            <p className="mb-2 text-gray-600">Cần hỗ trợ thêm?</p>
            <p className="font-medium text-gray-900">
              Hotline:{' '}
              <a href="tel:19001234" className="text-blue-600">
                1900 1234
              </a>
            </p>
            <p className="mt-1 text-sm text-gray-500">Hỗ trợ 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
