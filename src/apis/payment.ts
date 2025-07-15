import { api } from './client';

// Types based on backend DTOs
export interface PaymentInformationModel {
  quotationId: number;
  orderType: string; // Bắt buộc
  amount: number;
  orderDescription: string;
  name: string; // Bắt buộc
  language?: string;
  bankCode?: string;
  userName?: string;
  returnUrl?: string;
}

export interface MomoPaymentRequestModel {
  fullName: string;
  orderId: string;
  orderInfo: string;
  amount: number;
  returnUrl?: string;
}

export interface PaymentUrlResponse {
  message: string;
  data: string; // VNPay URL
}

export interface PaymentResponseModel {
  quotationId: number;
  orderDescription: string;
  transactionId: string;
  orderId: string;
  paymentId: string;
  success: boolean;
  token: string;
  vnPayResponseCode: string;
}

export interface CreateOrderRequest {
  userId: string;
  planId: string;
  price: number;
}

export interface CreateOrderResponse {
  success: boolean;
  id: string;
  message?: string;
}

export interface ErrorViewModel {
  rspCode: string;
  message: string;
}

// Payment API Functions
export const paymentAPI = {
  // POST /api/Payment - Tạo order trong database
  createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    try {
      const response = await api.post('/Payment', data);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể tạo đơn hàng');
    }
  },

  // POST /api/Payment/payment-url - Tạo payment URL
  createPaymentUrl: async (data: PaymentInformationModel): Promise<PaymentUrlResponse> => {
    try {
      const response = await api.postFullResponse<string>('/Payment/payment-url', data);

      if (!response) {
        throw new Error('No response received from server');
      }

      if (!response.data) {
        throw new Error('No data in response from server');
      }

      return {
        message: response.message || 'VNPay URL created successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Payment URL Error:', error);
      console.error('Request data was:', data);
      throw new Error(error.message || 'Không thể tạo URL thanh toán');
    }
  },

  // POST /api/Payment/momo-payment-url - Tạo Momo payment URL
  createMomoPaymentUrl: async (data: MomoPaymentRequestModel): Promise<PaymentUrlResponse> => {
    try {
      const response = await api.postFullResponse<string>('/Payment/momo-payment-url', data);

      if (!response || !response.data) {
        throw new Error('No response data from MoMo API');
      }

      return {
        message: response.message || 'MoMo URL created successfully',
        data: response.data,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Không thể tạo URL thanh toán MoMo');
    }
  },

  // GET /api/Payment/{id} - Lấy thông tin payment theo ID
  getPaymentById: async (paymentId: string): Promise<any> => {
    try {
      const response = await api.get(`/Payment/${paymentId}`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin thanh toán');
    }
  },

  // GET /api/Payment/user/{userId} - Lấy lịch sử thanh toán của user
  getUserPaymentHistory: async (userId: string): Promise<any> => {
    try {
      const response = await api.get(`/Payment/user/${userId}`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy lịch sử thanh toán');
    }
  },
};

// Helper functions
export const formatPaymentInformation = (
  planId: number,
  amount: number,
  description: string,
  userName: string,
  returnUrl?: string
) => {
  return {
    quotationId: planId, // Sử dụng planId cho quotationId
    orderType: 'PlanSubscription', // Thêm giá trị mặc định cho orderType
    amount,
    orderDescription: description, // Đổi tên từ description sang orderDescription
    name: userName, // Sử dụng userName cho name
    language: 'vn',
    bankCode: '',
    userName, // Giữ nguyên userName để tương thích với code hiện tại
    returnUrl: returnUrl || window.location.origin + '/payment/return',
  };
};

// Helper function to format Momo payment request
export const formatMomoPaymentRequest = (
  userName: string,
  orderId: string,
  orderInfo: string,
  amount: number,
  returnUrl?: string
) => {
  return {
    fullName: userName, // Đảm bảo đúng tên trường theo MomoPaymentRequestModel
    orderId,
    orderInfo,
    amount,
    returnUrl: returnUrl || window.location.origin + '/payment/return',
  };
};

export const formatCreateOrderRequest = (
  userId: string,
  planId: string,
  price: number
): CreateOrderRequest => {
  return {
    userId,
    planId,
    price,
  };
};
