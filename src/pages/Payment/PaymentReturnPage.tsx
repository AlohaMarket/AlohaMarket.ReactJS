import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/contexts';
import { keycloak } from '@/lib/keycloak';

export default function PaymentReturnPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setUser } = useApp();

  useEffect(() => {
    const processPaymentReturn = async () => {
      try {
        console.log('🔄 PaymentReturnPage: Xử lý return từ cổng thanh toán');

        // 1. Khôi phục thông tin từ localStorage trước
        const userProfile = localStorage.getItem('user_profile');

        // 2. Chuyển tất cả các tham số từ VNPay đến trang success
        const allParams = new URLSearchParams(searchParams);

        // 3. Thêm các tham số được lưu trong localStorage (nếu có)
        const savedPlan = localStorage.getItem('payment_plan_info');
        if (savedPlan) {
          try {
            const planData = JSON.parse(savedPlan);
            if (!allParams.has('planId') && planData.planId) {
              allParams.set('planId', planData.planId);
            }
            if (!allParams.has('title') && planData.title) {
              allParams.set('title', planData.title);
            }
            if (!allParams.has('price') && planData.price) {
              allParams.set('price', planData.price);
            }
          } catch (e) {
            console.error('Không thể parse thông tin gói từ localStorage', e);
          }
        }

        // 4. Khôi phục thông tin người dùng từ localStorage (nếu cần)
        if (!user && userProfile) {
          try {
            const userData = JSON.parse(userProfile);
            setUser({
              id: userData.sub,
              email: userData.email || '',
              name: userData.name || '',
              userName: userData.preferred_username || '',
              role: userData.role || 'user',
            });
            console.log('✅ PaymentReturnPage: Đã khôi phục user từ localStorage');
          } catch (e) {
            console.error('Không thể parse thông tin người dùng từ localStorage', e);
          }
        }

        // 5. Khởi tạo Keycloak (không cần đợi)
        if (!keycloak.authenticated) {
          keycloak
            .init({
              onLoad: 'check-sso',
              checkLoginIframe: false,
            })
            .then((authenticated) => {
              console.log('Keycloak init result:', authenticated);
            });
        }

        // 6. Chuyển hướng đến trang success sau 1 giây
        setTimeout(() => {
          navigate(`/payment/success?${allParams.toString()}`);
        }, 1000);
      } catch (error) {
        console.error('Lỗi trong PaymentReturnPage:', error);
        navigate('/payment/success?status=failed');
      }
    };

    processPaymentReturn();
  }, [navigate, searchParams, user, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Đang xử lý thanh toán</h3>
        <p className="text-gray-600">Hệ thống đang xác nhận giao dịch từ cổng thanh toán</p>
        <p className="mt-2 text-sm text-gray-500">Vui lòng không đóng cửa sổ này</p>
      </div>
    </div>
  );
}
