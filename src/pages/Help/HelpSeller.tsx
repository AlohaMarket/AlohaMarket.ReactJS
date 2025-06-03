import React from 'react';
import { Link } from 'react-router-dom';

const HelpSeller = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-blue-500 text-white font-bold">
        <div className="flex items-center justify-center">
          <img
            src="/src/assets/imgs/logo.png"
            alt="Aloha Market Logo"
            className="h-8 w-auto"
            style={{ filter: 'brightness(0) invert(1)' }} // chuyển icon sang trắng
          />
          | <Link to="/help" className="hover:underline"> Trung tâm trợ giúp</Link>
        </div>
        <div className="space-x-4">
          <Link to="/help/seller" className="hover:underline">Tôi là người bán</Link>
          <Link to="/help/buyer" className="hover:underline">Tôi là người mua</Link>
        </div>
      </header>

      {/* Title */}
      <div className="bg-blue-500 py-10 px-6 text-4xl font-bold text-white">
        TÔI LÀ NGƯỜI BÁN
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row p-6 gap-10">
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 text-gray-800">
          <h3 className="font-bold text-lg mb-2">Bán hàng tại Chợ Tốt ▾</h3>
          <ul className="space-y-2">
            <li>Bán hàng trên Chợ Tốt như thế nào ?</li>
            <li>Chợ Tốt kiểm duyệt tin rao của tôi như thế nào ?</li>
            <li>Tôi quản lý tin đăng bằng cách nào ?</li>
            <li>Hỗ trợ tài khoản</li>
            <li>Chat trên Chợ Tốt</li>
            <li>Chợ Tốt Ưu Đãi</li>
            <li>Tính năng Đánh giá</li>
            <li>Tính năng Bình luận</li>
            <li>Chuyên mục Điện tử</li>
            <li>Chuyên mục Xe</li>
            <li>Dịch vụ khách hàng</li>
          </ul>

          <div className="mt-6 space-y-2">
            <h3 className="font-bold">Dịch vụ có tính phí ▾</h3>
            <h3 className="font-bold">Phương thức thanh toán ▾</h3>
            <h3 className="font-bold">Chuyên mục Bất động sản ▾</h3>
            <h3 className="font-bold">Chuyên mục Việc làm - Việc Làm Tốt ▾</h3>
            <h3 className="font-bold">An toàn bán hàng ▾</h3>
          </div>
        </div>

        {/* Main Articles */}
        <div className="w-full lg:w-2/3 text-gray-800 space-y-8">
          {/* Section: Bán hàng trên Chợ Tốt như thế nào ? */}
          <div>
            <h2 className="text-xl font-bold mb-2">Bán hàng trên Chợ Tốt như thế nào ?</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Các bước rao bán một món hàng</li>
              <li>Đăng tin với ứng dụng Chợ Tốt</li>
              <li>Đăng nhanh bằng AI</li>
              <li>Hướng dẫn đăng tin có chứa Video trên Chợ Tốt</li>
              <li>Meo bán hàng hiệu quả với tin đăng có chứa Video</li>
              <li>Tin đăng chất lượng, bán hàng nhanh hơn</li>
              <li>Tôi phải làm gì nếu không đăng được tin/hình ảnh?</li>
              <li>Các chuyên mục đăng tin trên Chợ Tốt</li>
              <li>Đối Tác Chợ Tốt</li>
              <li>Trải nghiệm tuyệt vời với ứng dụng trên Android và iOS</li>
              <li>Hướng dẫn Yêu cầu xuất hóa đơn GTGT cho các giao dịch mua hàng</li>
            </ul>
          </div>

          {/* Section: Chợ Tốt kiểm duyệt tin rao của tôi như thế nào ? */}
          <div>
            <h2 className="text-xl font-bold mb-2">Chợ Tốt kiểm duyệt tin rao của tôi như thế nào ?</h2>
            <p>Tại sao Chợ Tốt duyệt tin trước khi đăng?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSeller;
