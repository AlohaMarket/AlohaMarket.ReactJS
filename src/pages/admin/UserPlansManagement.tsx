import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { planAPI, getDateRangePresets, createDateFilter, formatPlanPrice, getPlanBadgeColor } from '@/apis/plan';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    RefreshCw,
    Users,
    CreditCard,
    Activity,
    Filter,
    DollarSign
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Statistics interface
interface PlanStatistics {
    totalRevenue: number;
    totalUsers: number;
    totalActivePlans: number;
    planBreakdown: Array<{
        planName: string;
        planId: number;
        count: number;
        revenue: number;
        percentage: number;
    }>;
    revenueByDate: Array<{
        date: string;
        revenue: number;
        count: number;
    }>;
}

export default function UserPlansManagement() {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [selectedPreset, setSelectedPreset] = useState<string>('thisMonth');

    const datePresets = getDateRangePresets();

    // Initialize with current month
    useEffect(() => {
        const datePresets = getDateRangePresets();
        const preset = datePresets.thisMonth;
        setStartDate(preset.startDate.toISOString().split('T')[0]);
        setEndDate(preset.endDate.toISOString().split('T')[0]);
    }, []);

    // Query for user plans data
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
        enabled: !!startDate && !!endDate,
    });

    // Calculate statistics
    const statistics: PlanStatistics = useMemo(() => {
        if (!userPlans || userPlans.length === 0) {
            return {
                totalRevenue: 0,
                totalUsers: 0,
                totalActivePlans: 0,
                planBreakdown: [],
                revenueByDate: []
            };
        }

        // Mock plan prices (you should get these from your plans API)
        const planPrices: Record<string, number> = {
            'FREE': 0,
            'BASIC 1': 39000,
            'ADVANCED': 59000
        };

        const totalUsers = new Set(userPlans.map(plan => plan.userId)).size;
        const totalActivePlans = userPlans.filter(plan => plan.isActive).length;

        // Calculate plan breakdown
        const planCounts: Record<string, { count: number; revenue: number; planId: number }> = {};
        let totalRevenue = 0;

        userPlans.forEach(plan => {
            const planPrice = planPrices[plan.planName] || 0;
            totalRevenue += planPrice;

            if (!planCounts[plan.planName]) {
                planCounts[plan.planName] = { count: 0, revenue: 0, planId: plan.planId };
            }
            planCounts[plan.planName].count++;
            planCounts[plan.planName].revenue += planPrice;
        });

        const planBreakdown = Object.entries(planCounts).map(([planName, data]) => ({
            planName,
            planId: data.planId,
            count: data.count,
            revenue: data.revenue,
            percentage: (data.count / userPlans.length) * 100
        }));

        // Calculate revenue by date
        const revenueByDate: Record<string, { revenue: number; count: number }> = {};
        userPlans.forEach(plan => {
            const date = new Date(plan.startDate).toISOString().split('T')[0];
            const planPrice = planPrices[plan.planName] || 0;

            if (!revenueByDate[date]) {
                revenueByDate[date] = { revenue: 0, count: 0 };
            }
            revenueByDate[date].revenue += planPrice;
            revenueByDate[date].count++;
        });

        const revenueByDateArray = Object.entries(revenueByDate)
            .map(([date, data]) => ({
                date,
                revenue: data.revenue,
                count: data.count
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return {
            totalRevenue,
            totalUsers,
            totalActivePlans,
            planBreakdown,
            revenueByDate: revenueByDateArray
        };
    }, [userPlans]);

    // Handle preset selection
    const handlePresetChange = (presetKey: string) => {
        setSelectedPreset(presetKey);
        if (presetKey && presetKey !== 'custom' && datePresets[presetKey as keyof typeof datePresets]) {
            const preset = datePresets[presetKey as keyof typeof datePresets];
            setStartDate(preset.startDate.toISOString().split('T')[0]);
            setEndDate(preset.endDate.toISOString().split('T')[0]);
        }
    };

    // Handle manual date input
    const handleStartDateChange = (value: string) => {
        setStartDate(value);
        setSelectedPreset('custom'); // Set to custom when manually setting dates
    };

    const handleEndDateChange = (value: string) => {
        setEndDate(value);
        setSelectedPreset('custom'); // Set to custom when manually setting dates
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Thống kê gói người dùng</h1>
                    <p className="text-muted-foreground">
                        Theo dõi và phân tích thông tin gói của người dùng và doanh thu
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => refetch()}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Làm mới
                    </Button>
                </div>
            </div>

            {/* Date Filter */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        <CardTitle>Bộ lọc thời gian</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="preset-select">Khoảng thời gian</Label>
                            <Select value={selectedPreset} onValueChange={handlePresetChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn khoảng thời gian" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="custom">Tùy chỉnh</SelectItem>
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

                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setStartDate('');
                                    setEndDate('');
                                    setSelectedPreset('custom');
                                }}
                            >
                                Xóa bộ lọc
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Loading and Error States */}
            {isLoading && (
                <div className="flex justify-center items-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            )}

            {error && (
                <Card>
                    <CardContent className="text-center py-12">
                        <div className="text-red-500 mb-4">Có lỗi xảy ra khi tải dữ liệu</div>
                        <Button onClick={() => refetch()}>Thử lại</Button>
                    </CardContent>
                </Card>
            )}

            {/* Statistics Cards */}
            {!isLoading && !error && (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatPlanPrice(statistics.totalRevenue)}</div>
                                <p className="text-xs text-muted-foreground">
                                    Trong khoảng thời gian đã chọn
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{statistics.totalUsers}</div>
                                <p className="text-xs text-muted-foreground">
                                    Người dùng duy nhất
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Gói đang hoạt động</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{statistics.totalActivePlans}</div>
                                <p className="text-xs text-muted-foreground">
                                    Gói hiện tại còn hiệu lực
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng gói</CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{userPlans?.length || 0}</div>
                                <p className="text-xs text-muted-foreground">
                                    Tất cả gói đã đăng ký
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Plan Breakdown */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Phân bố theo gói</CardTitle>
                                <CardDescription>
                                    Số lượng và doanh thu theo từng gói
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {statistics.planBreakdown.map((plan) => (
                                        <div key={plan.planName} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge className={getPlanBadgeColor(plan.planName)}>
                                                    {plan.planName}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    ({plan.percentage.toFixed(1)}%)
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">{plan.count} người dùng</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatPlanPrice(plan.revenue)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Doanh thu theo ngày</CardTitle>
                                <CardDescription>
                                    5 ngày gần đây nhất
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {statistics.revenueByDate.slice(-5).map((item) => (
                                        <div key={item.date} className="flex items-center justify-between">
                                            <span className="text-sm">
                                                {new Date(item.date).toLocaleDateString('vi-VN')}
                                            </span>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">
                                                    {formatPlanPrice(item.revenue)}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {item.count} gói
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
