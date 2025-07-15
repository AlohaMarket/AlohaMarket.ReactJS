import { Crown, CheckCircle } from 'lucide-react';

interface ProStatusProps {
  variant?: 'compact' | 'detailed';
  className?: string;
}

export default function ProStatus({ variant = 'compact', className = '' }: ProStatusProps) {
  // For now, we'll check if user exists and is verified
  // You can later add proper Pro status checking based on subscription
  const isProUser = false; // Set to false for now, implement actual Pro checking later

  if (!isProUser) return null;

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 text-xs font-bold text-white ${className}`}
      >
        <Crown size={12} />
        <span>PRO</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border border-orange-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 p-2">
          <Crown size={20} className="text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">Tài khoản PRO</span>
            <CheckCircle size={16} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-600">Bạn đang sử dụng gói Pro với đầy đủ tính năng</p>
        </div>
      </div>
    </div>
  );
}
