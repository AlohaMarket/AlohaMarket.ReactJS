import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { QueryConfig } from '@/hooks/useQueryConfig';
import { Category } from '@/types/category.type';
import AsideFilter from './AsideFilter';

interface MobileFilterModalProps {
  queryConfig: QueryConfig;
  categories: Category[];
  onClose: () => void;
}

export default function MobileFilterModal({
  queryConfig,
  categories,
  onClose
}: MobileFilterModalProps) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Bộ lọc</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AsideFilter queryConfig={queryConfig} categories={categories} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button onClick={onClose} className="w-full bg-orange-500 hover:bg-orange-600">
            Xem kết quả
          </Button>
        </div>
      </div>
    </div>
  );
}