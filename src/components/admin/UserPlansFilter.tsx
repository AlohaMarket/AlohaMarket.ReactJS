import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { planAPI, getDateRangePresets, createDateFilter } from '@/apis/plan';
import type { UserPlanResponse } from '@/apis/plan';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Filter, Download } from 'lucide-react';

interface UserPlansFilterProps {
  onDataChange?: (data: UserPlanResponse[]) => void;
}

export default function UserPlansFilter({ onDataChange }: UserPlansFilterProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const datePresets = getDateRangePresets();

  // Query for filtered user plans
  const {
    data: userPlans,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['admin-user-plans', startDate, endDate],
    queryFn: () => {
      const dateFilter = createDateFilter(
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );
      return planAPI.getAllUserPlans(dateFilter);
    },
    enabled: true,
  });

  // Handle preset selection
  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey && datePresets[presetKey as keyof typeof datePresets]) {
      const preset = datePresets[presetKey as keyof typeof datePresets];
      setStartDate(preset.startDate.toISOString().split('T')[0]);
      setEndDate(preset.endDate.toISOString().split('T')[0]);
    }
  };

  // Handle manual date input
  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    setSelectedPreset(''); // Clear preset when manually setting dates
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    setSelectedPreset(''); // Clear preset when manually setting dates
  };

  // Clear filters
  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedPreset('');
  };

  // Export filtered data
  const handleExport = () => {
    if (userPlans) {
      const csvContent = [
        ['User ID', 'Plan Name', 'Start Date', 'End Date', 'Remain Posts', 'Remain Pushes', 'Is Active'],
        ...userPlans.map(plan => [
          plan.userId,
          plan.planName,
          plan.startDate,
          plan.endDate,
          plan.remainPosts.toString(),
          plan.remainPushes.toString(),
          plan.isActive ? 'Yes' : 'No'
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-plans-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Pass data to parent component
  useEffect(() => {
    if (userPlans && onDataChange) {
      onDataChange(userPlans);
    }
  }, [userPlans, onDataChange]);

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold">Lọc gói người dùng</h3>
      </div>

      {/* Preset Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="preset-select">Khoảng thời gian</Label>
          <Select value={selectedPreset} onValueChange={handlePresetChange}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tùy chỉnh</SelectItem>
              {Object.entries(datePresets).map(([key, preset]) => (
                <SelectItem key={key} value={key}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="start-date">Từ ngày</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="end-date">Đến ngày</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
          />
        </div>

        <div className="flex items-end gap-2">
          <Button
            variant="outline"
            onClick={handleClearFilters}
          >
            Xóa bộ lọc
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={!userPlans || userPlans.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất CSV
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
        <div className="text-sm text-gray-600">
          {isLoading && 'Đang tải...'}
          {error && 'Có lỗi xảy ra khi tải dữ liệu'}
          {userPlans && (
            <>
              Tìm thấy <strong>{userPlans.length}</strong> gói người dùng
              {(startDate || endDate) && (
                <span className="ml-2">
                  {startDate && `từ ${new Date(startDate).toLocaleDateString('vi-VN')}`}
                  {startDate && endDate && ' '}
                  {endDate && `đến ${new Date(endDate).toLocaleDateString('vi-VN')}`}
                </span>
              )}
            </>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>
    </div>
  );
}
