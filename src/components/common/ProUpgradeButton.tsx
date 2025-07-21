import { Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ProUpgradeButton() {
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    // Cho phép truy cập Pro page mà không cần đăng nhập để test
    navigate('/payment/pro');
  };

  return (
    <Button
      onClick={handleUpgradeClick}
      className="group relative transform overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 px-4 py-2 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600 hover:shadow-xl"
    >
      <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>

      <div className="relative flex items-center gap-2">
        <Crown
          size={18}
          className="text-yellow-200 transition-colors group-hover:text-yellow-100"
        />
        <span className="text-sm font-bold tracking-wide">NÂNG CẤP PRO</span>
        <Sparkles
          size={16}
          className="animate-pulse text-yellow-200 transition-colors group-hover:text-yellow-100"
        />
      </div>

      <div className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-red-500"></div>
      <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-600"></div>
    </Button>
  );
}
