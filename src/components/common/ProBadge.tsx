import { Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProBadgeProps {
  variant?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function ProBadge({ variant = 'medium', className = '' }: ProBadgeProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Cho phép truy cập Pro page mà không cần đăng nhập để test
    navigate('/payment/pro');
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    small: 14,
    medium: 16,
    large: 20,
  };

  return (
    <div
      onClick={handleClick}
      className={`inline-flex transform cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-yellow-500 hover:to-orange-600 hover:shadow-xl ${sizeClasses[variant]} ${className} `}
    >
      <Crown size={iconSizes[variant]} className="text-yellow-100" />
      <span className="font-extrabold tracking-wide">PRO</span>
    </div>
  );
}
