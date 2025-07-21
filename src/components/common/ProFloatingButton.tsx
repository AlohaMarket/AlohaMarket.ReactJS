import { Crown, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProFloatingButton() {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    // Cho phép truy cập Pro page mà không cần đăng nhập để test
    navigate('/payment/pro');
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="group fixed bottom-6 right-6 z-50">
      {/* Main floating button */}
      <div
        onClick={handleUpgradeClick}
        className="hover:shadow-3xl relative transform cursor-pointer rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-4 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600"
      >
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 opacity-30"></div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full -skew-x-12 transform rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>

        {/* Content */}
        <div className="relative flex items-center gap-3">
          <Crown size={24} className="animate-pulse text-yellow-200" />
          <div className="hidden sm:block">
            <div className="text-sm font-bold">NÂNG CẤP PRO</div>
            <div className="text-xs opacity-90">Tính năng cao cấp</div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
        >
          <X size={14} />
        </button>

        {/* Notification dot */}
        <div className="absolute -left-1 -top-1 h-4 w-4 animate-bounce rounded-full bg-red-500">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600 opacity-75"></div>
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
        <div className="whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white">
          Mở khóa tính năng PRO!
          <div className="absolute right-4 top-full border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
}
