import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

export default function PaymentReturnPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processPaymentReturn = async () => {
      try {
        console.log('=== PROCESSING PAYMENT RETURN ===');

        // Lấy thông tin từ URL params (real VNPay callback) hoặc location state (mock)
        let params: any = {};
        let isRealCallback = false;

        // Kiểm tra xem có phải callback từ VNPay không (có vnp_ params trong URL)
        const hasVnpParams = Array.from(searchParams.keys()).some((key) => key.startsWith('vnp_'));

        if (hasVnpParams) {
          // REAL VNPay callback
          console.log('🔗 Processing REAL VNPay callback');
          isRealCallback = true;
          params = {
            vnp_ResponseCode: searchParams.get('vnp_ResponseCode'),
            vnp_TxnRef: searchParams.get('vnp_TxnRef'),
            vnp_TransactionNo: searchParams.get('vnp_TransactionNo'),
            vnp_Amount: searchParams.get('vnp_Amount'),
            vnp_OrderInfo: searchParams.get('vnp_OrderInfo'),
            vnp_PayDate: searchParams.get('vnp_PayDate'),
            vnp_BankCode: searchParams.get('vnp_BankCode'),
            vnp_CardType: searchParams.get('vnp_CardType'),
          };
        } else {
          // Mock callback từ location state
          console.log('🧪 Processing MOCK callback');
          params = location.state || {};
        }

        console.log('Callback params:', params);
        console.log('Is real callback:', isRealCallback);

        const responseCode = params.vnp_ResponseCode;
        const orderId = params.vnp_TxnRef;
        const transactionId = params.vnp_TransactionNo;
        const amount = params.vnp_Amount;
        const orderInfo = params.vnp_OrderInfo;
        const payDate = params.vnp_PayDate;
        const bankCode = params.vnp_BankCode;

        // Lấy thông tin pending payment
        const pendingPaymentStr = localStorage.getItem('pendingPayment');
        const pendingPayment = pendingPaymentStr ? JSON.parse(pendingPaymentStr) : null;

        console.log('Pending payment:', pendingPayment);

        if (!responseCode) {
          throw new Error('Không nhận được mã phản hồi từ cổng thanh toán');
        }

        // Xác định kết quả thanh toán
        const isSuccess = responseCode === '00';
        const finalAmount = amount ? parseInt(amount) / 100 : pendingPayment?.amount || 0;

        console.log('Payment result:', {
          isSuccess,
          responseCode,
          orderId,
          transactionId,
          finalAmount,
          orderInfo,
          payDate,
          bankCode,
          isRealCallback,
        });

        // Xóa pending payment
        localStorage.removeItem('pendingPayment');

        // Chuẩn bị data cho result page
        const resultData = {
          orderId: orderId || pendingPayment?.orderId || 'N/A',
          amount: finalAmount,
          method: pendingPayment?.method || 'vnpay',
          category: pendingPayment?.category,
          categoryTitle: pendingPayment?.categoryTitle,
          transactionId: transactionId || 'N/A',
          paymentId: pendingPayment?.paymentId,
          quotationId: pendingPayment?.quotationId,
          userId: pendingPayment?.userId,
          planId: pendingPayment?.planId,
          orderInfo: orderInfo,
          payDate: payDate,
          bankCode: bankCode,
          isRealPayment: pendingPayment?.isRealPayment || isRealCallback,
        };

        if (isSuccess) {
          console.log('✅ Payment SUCCESS - redirecting to success page');
          // Redirect tới success page
          navigate('/payment/success', {
            state: {
              ...resultData,
              status: 'success',
            },
          });
        } else {
          console.log('❌ Payment FAILED - redirecting to failed page');
          // Mapping lỗi VNPay
          const errorMessages: { [key: string]: string } = {
            '01': 'Giao dịch chưa hoàn tất',
            '02': 'Giao dịch bị lỗi',
            '04': 'Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công)',
            '05': 'VNPAY đang xử lý giao dịch này (GD hoàn tiền)',
            '06': 'VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)',
            '07': 'Giao dịch bị nghi ngờ gian lận',
            '09': 'GD Hoàn trả bị từ chối',
            '10': 'Đã giao hàng',
            '11': 'Đã hủy (do khách hàng hủy GD)',
            '12': 'Đã hủy (do người bán hủy)',
          };

          navigate('/payment/failed', {
            state: {
              ...resultData,
              status: 'failed',
              error: errorMessages[responseCode] || `Thanh toán thất bại. Mã lỗi: ${responseCode}`,
            },
          });
        }
      } catch (error: any) {
        console.error('❌ Payment return processing error:', error);

        localStorage.removeItem('pendingPayment');

        navigate('/payment/failed', {
          state: {
            status: 'failed',
            error: error.message || 'Có lỗi xảy ra khi xử lý kết quả thanh toán',
          },
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentReturn();
  }, [location, navigate, searchParams]);

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div>
          <p className="text-gray-600">Đang xử lý kết quả thanh toán...</p>
          <p className="mt-2 text-sm text-gray-500">Vui lòng không đóng trang</p>
          <div className="mt-4 space-y-1 text-xs text-gray-400">
            <p>Đang xác minh giao dịch với VNPay</p>
            <p>Thời gian xử lý: 3-5 giây</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
