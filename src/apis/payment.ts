import { api } from './client';

// Types based on backend DTOs
export interface PaymentInformationModel {
  quotationId: number;
  orderType: string;
  amount: number;
  orderDescription: string;
  name: string;
}

// Add new interface for Momo Payment Request
export interface MomoPaymentRequestModel {
  fullName: string;
  orderId: string;
  orderInfo: string;
  amount: number;
}

// Real response format từ backend
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
      return response.data;
    } catch (error: any) {
      console.error('Create order error:', error);
      console.error('Error details:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Không thể tạo đơn hàng');
    }
  },

  // POST /api/Payment/payment-url - Tạo payment URL (REAL API)
  createPaymentUrl: async (data: PaymentInformationModel): Promise<PaymentUrlResponse> => {
    try {
      console.log('🚀 Gọi API VNPay với dữ liệu:', JSON.stringify(data, null, 2));

      const response = await api.postFullResponse<string>('/Payment/payment-url', data);

      console.log('📦 Full response từ API:', JSON.stringify(response, null, 2));
      console.log('📋 Response message:', response.message);
      console.log('📋 Response data (URL):', response.data);

      // Kiểm tra response có tồn tại không
      if (!response) {
        console.error('❌ Response is null/undefined');
        throw new Error('No response received from server');
      }

      // Kiểm tra response.data có tồn tại không
      if (!response.data) {
        console.error('❌ Response.data is null/undefined');
        throw new Error('No data in response from server');
      }

      // Trả về response theo format PaymentUrlResponse
      return {
        message: response.message || 'VNPay URL created successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('❌ API Error:', error);
      throw new Error(error.message || 'Không thể tạo URL thanh toán');
    }
  },

  // POST /api/Payment/momo-payment-url - Tạo Momo payment URL
  createMomoPaymentUrl: async (data: MomoPaymentRequestModel): Promise<PaymentUrlResponse> => {
    try {
      console.log('🚀 Gọi API MoMo với dữ liệu:', JSON.stringify(data, null, 2));

      const response = await api.postFullResponse<string>('/Payment/momo-payment-url', data);

      console.log('📦 MoMo Full response từ API:', JSON.stringify(response, null, 2));

      if (!response || !response.data) {
        throw new Error('No response data from MoMo API');
      }

      return {
        message: response.message || 'MoMo URL created successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('❌ MoMo API Error:', error);
      throw new Error(error.message || 'Không thể tạo URL thanh toán MoMo');
    }
  },

  // Mock function để test
  createPaymentUrlMock: async (data: PaymentInformationModel): Promise<PaymentUrlResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response theo format thật
    const mockResponse: PaymentUrlResponse = {
      message: 'VNPay URL created successfully! (Mock)',
      data: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${data.amount * 100}&vnp_Command=pay&vnp_CreateDate=${Date.now()}&vnp_TxnRef=ORDER_${Date.now()}&mock=true`,
    };
    return mockResponse;
  },

  // GET /api/Payment/{id} - Lấy thông tin payment theo ID
  getPaymentById: async (paymentId: string): Promise<any> => {
    try {
      const response = await api.get(`/Payment/${paymentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin thanh toán');
    }
  },

  // GET /api/Payment/user/{userId} - Lấy lịch sử thanh toán của user
  getUserPaymentHistory: async (userId: string): Promise<any> => {
    try {
      const response = await api.get(`/Payment/user/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể lấy lịch sử thanh toán');
    }
  },
};

// Helper functions với format data đúng như backend expect
export const formatPaymentInformation = (
  quotationId: number,
  amount: number,
  categoryTitle: string,
  userName: string
): PaymentInformationModel => {
  return {
    quotationId,
    orderType: 'billpayment',
    amount,
    orderDescription: `${userName} Thanh toán gói dịch vụ ${categoryTitle} ${amount}`,
    name: userName,
  };
};

// Helper function to format Momo payment request
export const formatMomoPaymentRequest = (
  fullName: string,
  orderId: string,
  orderInfo: string,
  amount: number
): MomoPaymentRequestModel => {
  return {
    fullName,
    orderId,
    orderInfo,
    amount,
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

// Mock data để test với format giống backend
export const getMockPaymentData = (): PaymentInformationModel => {
  return {
    quotationId: 1001,
    orderType: 'billpayment',
    amount: 1500000, // Match với backend example
    orderDescription: 'Nguyen Van A Thanh toán gói dịch vụ Premium tháng 6 1500000',
    name: 'Nguyen Van A',
  };
};

// Mock data for Momo request
export const getMockMomoPaymentData = (
  fullName: string,
  orderId: string,
  orderInfo: string,
  amount: number
): MomoPaymentRequestModel => {
  return {
    fullName,
    orderId,
    orderInfo,
    amount,
  };
};

// Helper để extract thông tin từ VNPay URL
export const extractOrderInfoFromUrl = (vnpayUrl: string) => {
  try {
    const url = new URL(vnpayUrl);
    const params = new URLSearchParams(url.search);

    return {
      orderId: params.get('vnp_TxnRef'),
      amount: params.get('vnp_Amount') ? parseInt(params.get('vnp_Amount')!) / 100 : 0,
      orderInfo: params.get('vnp_OrderInfo'),
      createDate: params.get('vnp_CreateDate'),
    };
  } catch (error) {
    console.error('Error extracting order info from URL:', error);
    return null;
  }
};
