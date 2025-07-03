import { createSearchParams, useNavigate } from 'react-router-dom';
import { Grid, List, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { type QueryConfig } from '@/hooks/useQueryConfig';
import { cn } from '@/lib/utils';

interface SortBarProps {
  queryConfig: QueryConfig;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onShowMobileFilter: () => void;
}

const sortOptions = [
  { value: 'createdAt', label: 'Mới nhất', order: 'desc' },
  { value: 'price', label: 'Giá thấp đến cao', order: 'asc' },
  { value: 'price', label: 'Giá cao đến thấp', order: 'desc' },
];

export default function SortBar({
  queryConfig,
  totalItems,
  currentPage,
  totalPages,
  viewMode,
  onViewModeChange,
  onShowMobileFilter
}: SortBarProps) {
  const navigate = useNavigate();
  const { sortBy = 'createdAt', order = 'desc' } = queryConfig;

  const handleSort = (sortValue: string, orderValue: string) => {
    navigate({
      pathname: '/posts',
      search: createSearchParams({
        ...queryConfig,
        sortBy: sortValue,
        order: orderValue,
        page: '1'
      }).toString()
    });
  };

  // Calculate item range
  const limit = parseInt(queryConfig.pageSize || '20');
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Sort options */}
        <div className="flex items-center gap-4">
          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onShowMobileFilter}
            className="lg:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            Lọc
          </Button>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:block">Sắp xếp:</span>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    option.value === sortBy && option.order === order
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleSort(option.value, option.order)}
                  className={cn(
                    "text-xs sm:text-sm",
                    option.value === sortBy && option.order === order &&
                    "bg-orange-500 hover:bg-orange-600 text-white"
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: View controls & pagination info */}
        <div className="flex items-center gap-4">
          {/* Result count */}
          <div className="text-sm text-gray-600 hidden sm:block">
            {startItem}-{endItem} của {totalItems.toLocaleString()} kết quả
          </div>

          {/* View mode toggle */}
          <div className="flex items-center border border-gray-200 rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                "p-2 rounded-r-none",
                viewMode === 'grid' && "bg-gray-100"
              )}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('list')}
              className={cn(
                "p-2 rounded-l-none border-l",
                viewMode === 'list' && "bg-gray-100"
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Page navigation mini */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-orange-500 font-medium">{currentPage}</span>
            <span className="text-gray-500">/ {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}