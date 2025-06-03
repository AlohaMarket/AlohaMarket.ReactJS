import React from 'react';
import { Link } from 'react-router-dom';

const HelpBuyer = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}      <header className="flex items-center justify-between px-6 py-4 bg-blue-500 text-white font-bold">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:opacity-80">
            <img
              src="/src/assets/imgs/logo.png"
              alt="Aloha Market Logo"
              className="h-8 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }} // chuyển icon sang trắng
            />
          </Link>
          <span>|</span>
          <Link to="/help" className="hover:underline">Trung tâm trợ giúp</Link>
        </div>
        <div className="space-x-4">
            <Link to="/help/seller" className="hover:underline">Tôi là người bán</Link>
            <Link to="/help/buyer" className="hover:underline">Tôi là người mua</Link>
        </div>
      </header>

      {/* Title */}
      <div className="bg-blue-500 py-10 px-6 text-4xl font-bold text-white">
        TÔI LÀ NGƯỜI MUA
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row p-6 gap-10">
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 text-gray-800">
          <h3 className="font-bold text-lg mb-2">Mua hàng tại Chợ Tốt ▾</h3>
          <ul className="space-y-2">
            <li>Mua hàng tại Chợ Tốt như thế nào?</li>
            <li>Chợ Tốt Official Store</li>
            <li>Chat trên Chợ Tốt</li>
            <li>Tính năng Đánh giá</li>
            <li>Tính năng Bình Luận</li>
            <li>Chợ Tốt Ưu Đãi</li>
          </ul>

          <h3 className="font-bold mt-6">An toàn mua hàng ▾</h3>
          <h3 className="font-bold mt-2">Quy định cần biết ▾</h3>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-2/3 text-gray-800 space-y-8">
          {/* Section: Mua hàng tại Chợ Tốt như thế nào? */}
          <div>
            <h2 className="text-xl font-bold mb-2">Mua hàng tại Chợ Tốt như thế nào?</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Các bước tìm kiếm một sản phẩm</li>
              <li>Tại sao nên tạo tài khoản tại Chợ Tốt để mua hàng?</li>
              <li>Làm sao để tìm tin đăng theo khu vực bạn mong muốn?</li>
              <li>Cách lưu tin đăng trên Chợ Tốt</li>
              <li>Hướng dẫn sử dụng tính năng Theo dõi Trang cá nhân</li>
              <li>Meo tìm kiếm hiệu quả</li>
              <li>Làm thế nào để báo cáo tin đăng?</li>
              <li>Làm thế nào để tìm được món hàng giá hời?</li>
              <li>Làm thế nào để Đặt hàng trực tuyến trên Chợ Tốt Xe?</li>
              <li>Làm thế nào để liên lạc với người bán?</li>
              <li>Tiện ích hỗ trợ người đi vay</li>
              <li>Xe đã được kiểm tra chất lượng trên Chợ Tốt Xe là gì?</li>
            </ul>
          </div>

          {/* Section: Chợ Tốt Official Store */}
          <div>
            <h2 className="text-xl font-bold mb-2">Chợ Tốt Official Store</h2>
            {/* More content could go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpBuyer;
