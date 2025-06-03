/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  MapPin,
  Bell,
  MessageSquare,
  Briefcase,
  Grid,
  User,
  Search,
} from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState('Toàn Quốc');
  const [showAddress, setShowAddress] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddress(false);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setShowCategory(false);
  };

  const handleAuthAction = (action: 'login' | 'register') => {
    setShowAccount(false);
    navigate(`/auth?mode=${action}`);
  };

  return (
    <header className="bg-blue-600 text-white">
      {/* Top navigation bar */}
      <div className="flex items-center justify-between border-b border-blue-800 bg-blue-700 px-4 py-2 text-sm text-white">
        <div className="flex space-x-6">
          {['Chợ Tốt', 'Nhà Tốt', 'Chợ Tốt Xe', 'Việc Làm Tốt'].map((label) => (
            <a key={label} href="#" className="transition hover:text-gray-200">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          {[
            { label: 'Đóng góp ý kiến', href: 'feedback' },
            { label: 'Tải ứng dụng', href: 'download-app' },
            { label: 'Trợ giúp', href: 'help' }
          ].map(({ label, href }) => (
            <a key={label} href={href} className="transition hover:text-gray-200">
              {label}
            </a>
          ))}
          <a 
            href="/seller" 
            className="flex cursor-pointer items-center space-x-1 rounded bg-blue-600 px-2 py-1 transition hover:bg-blue-500"
          >
            <Briefcase size={16} className="text-white" />
            <span className="text-xs font-medium">Dành cho người bán</span>
            <ChevronDown size={16} className="text-white" />
          </a>
        </div>
      </div>

      {/* Main header bar */}
      <div className="flex items-center justify-between bg-blue-600 px-4 py-3">
        {/* left - điều chỉnh để chiếm nhiều không gian hơn */}
        <div className="flex flex-grow items-center gap-4">
          {/* Logo nổi bật hơn */}
          <div className="flex items-center justify-center">
            <img
              src="/src/assets/imgs/logo.png"
              alt="Aloha Market Logo"
              className="h-8 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }} // chuyển icon sang trắng
            />
          </div>
          {/* Danh mục có dropdown */}
          <div className="relative">
            <div
              className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 transition hover:bg-blue-500"
              onClick={() => setShowCategory((v) => !v)}
            >
              <Menu size={18} className="text-white" />
              <span className="text-sm font-medium">{selectedCategory || 'Danh mục'}</span>
              <ChevronDown size={16} className="text-white" />
            </div>
            {showCategory && (
              <div className="animate-fadeIn absolute left-0 top-full z-20 mt-2 w-48 rounded bg-white text-gray-800 shadow-lg">
                {['Điện thoại', 'Xe cộ', 'Đồ điện tử', 'Thời trang', 'Bất động sản'].map((cat) => (
                  <div
                    key={cat}
                    className="cursor-pointer px-4 py-2 transition hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn sự kiện click lan tỏa lên phần tử cha
                      handleSelectCategory(cat);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* search/address - điều chỉnh để flex-grow có giá trị cao hơn */}
          <div className="min-w-6xl relative flex-grow">
            <div className="flex items-center overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
              <div
                className="flex cursor-pointer select-none items-center gap-1 px-4 py-2 transition hover:bg-gray-100"
                onClick={() => setShowAddress((v) => !v)}
              >
                <MapPin size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{selectedAddress}</span>
                <ChevronDown size={16} className="text-gray-600" />
              </div>
              <Input
                className="flex-1 border-none bg-white px-4 py-2 text-gray-800 placeholder-gray-400 focus:ring-0"
                placeholder="Tìm kiếm trên Chợ Tốt Xe"
              />
              <button className="flex items-center justify-center bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600">
                <Search size={20} />
              </button>
            </div>
            {showAddress && (
              <div className="absolute left-0 top-full z-10 mt-1 w-56 rounded bg-white shadow-lg">
                {['Toàn Quốc', 'Tp HCM', 'Hà Nội', 'Đà Nẵng'].map((city) => (
                  <div
                    key={city}
                    className="cursor-pointer px-4 py-2 text-gray-800 transition hover:bg-orange-100 hover:text-orange-600"
                    onClick={() => handleSelectAddress(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* right - thu gọn các phần tử để nhường không gian cho ô tìm kiếm */}
        <div className="ml-4 flex items-center gap-4">
          {[Bell, MessageSquare, Briefcase, Grid].map((Icon, i) => (
            <Icon
              key={i}
              size={20}
              className="cursor-pointer text-white transition hover:text-gray-200"
            />
          ))}

          <div className="relative">
            <div
              className="flex cursor-pointer items-center gap-1 transition hover:text-gray-200"
              onClick={() => setShowAccount((v) => !v)}
            >
              <User size={20} className="text-white" />
              <span className="text-sm">Tài khoản</span>
              <ChevronDown size={16} className="text-white" />
            </div>
            {showAccount && (
              <div className="absolute right-0 top-full z-[100] mt-2 w-40 rounded bg-white p-2 shadow-lg">
                <div
                  className="cursor-pointer rounded px-2 py-1 text-gray-800 transition hover:bg-orange-100 hover:text-orange-600"
                  onClick={() => handleAuthAction('login')}
                >
                  Đăng nhập
                </div>
                <div
                  className="cursor-pointer rounded px-2 py-1 text-gray-800 transition hover:bg-orange-100 hover:text-orange-600"
                  onClick={() => handleAuthAction('register')}
                >
                  Đăng ký
                </div>
              </div>
            )}
          </div>

          <Button className="rounded-lg bg-orange-500 px-4 py-2 font-bold text-white shadow-lg transition hover:bg-orange-600">
            <span className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14m7-7H5" />
              </svg>
              ĐĂNG TIN
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
