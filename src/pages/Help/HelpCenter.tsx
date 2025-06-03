import React from "react";
import { Input } from "@/components/ui/input";
import { Search, StoreIcon, ShoppingCartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HelpCenter() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-400 to-blue-200">
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
        </div><div className="space-x-4">
          <Link to="/help/seller" className="hover:underline">Tôi là người bán</Link>
          <Link to="/help/buyer" className="hover:underline">Tôi là người mua</Link>
        </div>
      </header>

      {/* Search Section */}
      <section className="flex flex-col items-center py-10 text-center">
        <h1 className="text-4xl font-bold mb-4">CHÚNG TÔI CÓ THỂ GIÚP GÌ CHO BẠN?</h1>
        <div className="flex items-center bg-white rounded-md shadow-md w-1/2 p-3">
          <Search className="w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Nhập từ khóa tìm kiếm"
            className="flex-grow outline-none ml-3 text-lg"
          />
        </div>
        <div className="mt-4 text-sm text-gray-800">
          Từ khóa phổ biến:
          <span className="ml-2 text-blue-700 underline space-x-2">
            <a href="#">đăng tin</a>, <a href="#">nạp tiền</a>, <a href="#">Đồng Tốt</a>,
            <a href="#">Đẩy tin</a>, <a href="#">Tin ưu tiên</a>, <a href="#">phương thức thanh toán</a>,
            <a href="#">đổi số điện thoại</a>
          </span>
        </div>
      </section>

      {/* User Roles */}
      <section className="flex justify-center gap-6 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-md w-96 flex flex-col items-center">
          <StoreIcon className="w-16 h-16 text-blue-500" />
          <h2 className="text-xl font-bold mt-2">Tôi là người bán</h2>
          <p className="text-center text-gray-600 mt-2">
            Những mẹo vặt, các hướng dẫn giúp bán hàng nhanh chóng và tiện lợi trên Aloha
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md w-96 flex flex-col items-center">
          <ShoppingCartIcon className="w-16 h-16 text-green-500" />
          <h2 className="text-xl font-bold mt-2">Tôi là người mua</h2>
          <p className="text-center text-gray-600 mt-2">
            Những mẹo vặt, các hướng dẫn giúp mua hàng nhanh chóng và tiện lợi trên Aloha
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white mt-10 px-8 py-12">
        <h3 className="text-2xl font-semibold mb-6">Câu hỏi thường gặp</h3>
        <div className="grid grid-cols-2 gap-4 text-blue-700 underline text-sm">
          <a href="#">Cách nạp Đồng Tốt vào tài khoản</a>
          <a href="#">Tôi được đăng bao nhiêu tin với một tài khoản?</a>
          <a href="#">Đồng Tốt là gì?</a>
          <a href="#">Hướng dẫn đăng lại tin khi tin bị từ chối</a>
          <a href="#">Đẩy tin là gì?</a>
          <a href="#">Tôi phải làm gì khi tin đăng của tôi bị từ chối?</a>
          <a href="#">Tôi cần làm gì để thay đổi thông tin cá nhân?</a>
          <a href="#">Các bước rao bán một món hàng</a>
          <a href="#">Tôi cần làm gì để Xoá tin đã đăng?</a>
          <a href="#">Mẹo mua hàng an toàn</a>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-gray-100 px-8 py-12">
        <h3 className="text-2xl font-semibold mb-6">Tin tức mới</h3>
        <div className="grid grid-cols-3 gap-6 text-sm text-gray-700">
          <div>
            <h4 className="font-bold">Thông báo: Ra mắt danh mục mới "Dịch vụ chăm sóc nhà cửa"</h4>
            <p>27/03/2025 16:18</p>
            <p>Nhằm nâng cao trải nghiệm của người dùng...</p>
            <a href="#" className="text-blue-700">Xem thêm »</a>
          </div>
          <div>
            <h4 className="font-bold">Thông báo: Tạm tắt tính năng "AI – Quét Là Bán"</h4>
            <p>17/03/2025 08:26</p>
            <p>Aloha sẽ tiến hành bảo trì và nâng cấp...</p>
            <a href="#" className="text-blue-700">Xem thêm »</a>
          </div>
          <div>
            <h4 className="font-bold">Thông báo: Thay đổi cơ chế gia hạn Đồng Tốt</h4>
            <p>23/12/2024 16:05</p>
            <p>Hạn sử dụng của Đồng Tốt trong Tài Khoản Chính...</p>
            <a href="#" className="text-blue-700">Xem thêm »</a>
          </div>
        </div>
      </section>
    </div>
  );
}
