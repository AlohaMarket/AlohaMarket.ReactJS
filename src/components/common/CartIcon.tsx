import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts';

export default function CartIcon() {
  const { t } = useTranslation();
  const { totalItems, totalPrice } = useCart();

  return (
    <Link
      to="/cart"
      className="relative flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors"
    >
      <div className="relative">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
          />
        </svg>
        
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </div>
      
      <div className="hidden md:flex flex-col">
        <span className="text-sm font-medium">{t('navigation.cart')}</span>
        <span className="text-xs text-gray-500">
          ${totalPrice.toFixed(2)}
        </span>
      </div>
    </Link>
  );
} 