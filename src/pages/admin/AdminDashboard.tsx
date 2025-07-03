import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Plus,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Smartphone,
  Laptop,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import type { LucideIcon } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  description: string;
  color: string;
}

const stats: StatCard[] = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: 20.1,
    icon: DollarSign,
    description: 'from last month',
    color: 'from-green-500 to-emerald-600'
  },
  {
    title: 'Total Users',
    value: '2,350',
    change: 8.2,
    icon: Users,
    description: 'from last month',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    title: 'Total Products',
    value: '1,234',
    change: 12.5,
    icon: Package,
    description: 'from last month',
    color: 'from-purple-500 to-pink-600'
  },
  {
    title: 'Total Orders',
    value: '573',
    change: -2.1,
    icon: ShoppingCart,
    description: 'from last month',
    color: 'from-orange-500 to-red-600'
  }
];

interface RecentOrder {
  id: string;
  customer: string;
  email: string;
  amount: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

const recentOrders: RecentOrder[] = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    amount: '$250.00',
    status: 'processing'
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    amount: '$150.00',
    status: 'shipped'
  },
  {
    id: 'ORD-003',
    customer: 'Bob Johnson',
    email: 'bob@example.com',
    amount: '$300.00',
    status: 'delivered'
  },
  {
    id: 'ORD-004',
    customer: 'Alice Brown',
    email: 'alice@example.com',
    amount: '$89.99',
    status: 'pending'
  },
  {
    id: 'ORD-005',
    customer: 'Charlie Wilson',
    email: 'charlie@example.com',
    amount: '$199.99',
    status: 'cancelled'
  }
];

// Chart Data
const revenueData = [
  { month: 'Jan', revenue: 4000, orders: 240, users: 180 },
  { month: 'Feb', revenue: 3000, orders: 198, users: 220 },
  { month: 'Mar', revenue: 5000, orders: 300, users: 280 },
  { month: 'Apr', revenue: 4500, orders: 278, users: 320 },
  { month: 'May', revenue: 6000, orders: 389, users: 380 },
  { month: 'Jun', revenue: 5500, orders: 349, users: 410 },
  { month: 'Jul', revenue: 7000, orders: 430, users: 450 }
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#3b82f6' },
  { name: 'Clothing', value: 25, color: '#8b5cf6' },
  { name: 'Books', value: 20, color: '#10b981' },
  { name: 'Home & Garden', value: 15, color: '#f59e0b' },
  { name: 'Others', value: 5, color: '#ef4444' }
];

const deviceData = [
  { device: 'Desktop', users: 45, color: '#3b82f6' },
  { device: 'Mobile', users: 35, color: '#8b5cf6' },
  { device: 'Tablet', users: 20, color: '#10b981' }
];

const trafficSources = [
  { source: 'Direct', visits: 4200, percentage: 35 },
  { source: 'Search', visits: 3600, percentage: 30 },
  { source: 'Social', visits: 2400, percentage: 20 },
  { source: 'Email', visits: 1200, percentage: 10 },
  { source: 'Referral', visits: 600, percentage: 5 }
];

// Additional Chart Data
const salesFunnelData = [
  { stage: 'Visitors', value: 10000, color: '#3b82f6' },
  { stage: 'Leads', value: 5000, color: '#8b5cf6' },
  { stage: 'Prospects', value: 2000, color: '#10b981' },
  { stage: 'Customers', value: 800, color: '#f59e0b' },
  { stage: 'Repeat', value: 320, color: '#ef4444' }
];

const performanceData = [
  { metric: 'Speed', value: 85, fullMark: 100 },
  { metric: 'Security', value: 92, fullMark: 100 },
  { metric: 'Accessibility', value: 78, fullMark: 100 },
  { metric: 'SEO', value: 88, fullMark: 100 },
  { metric: 'Mobile', value: 95, fullMark: 100 },
  { metric: 'Performance', value: 82, fullMark: 100 }
];

const hourlyData = [
  { hour: '00:00', users: 120, sales: 1200 },
  { hour: '04:00', users: 80, sales: 800 },
  { hour: '08:00', users: 350, sales: 3500 },
  { hour: '12:00', users: 620, sales: 6200 },
  { hour: '16:00', users: 480, sales: 4800 },
  { hour: '20:00', users: 290, sales: 2900 },
  { hour: '23:59', users: 150, sales: 1500 }
];

const geographicData = [
  { country: 'United States', users: 35, sales: 12500 },
  { country: 'United Kingdom', users: 25, sales: 8500 },
  { country: 'Germany', users: 20, sales: 7200 },
  { country: 'France', users: 12, sales: 4800 },
  { country: 'Canada', users: 8, sales: 3200 }
];

// Additional Chart Data for more comprehensive analytics
const monthlyComparison = [
  { metric: 'Revenue', thisMonth: 45231, lastMonth: 37658, growth: 20.1 },
  { metric: 'Orders', thisMonth: 573, lastMonth: 586, growth: -2.2 },
  { metric: 'Customers', thisMonth: 2350, lastMonth: 2169, growth: 8.3 },
  { metric: 'Products', thisMonth: 1234, lastMonth: 1101, growth: 12.1 }
];

const topProducts = [
  { name: 'iPhone 15 Pro', sales: 1250, revenue: 1249000, growth: 15.2 },
  { name: 'MacBook Air M2', sales: 890, revenue: 1068000, growth: 23.1 },
  { name: 'AirPods Pro', sales: 1850, revenue: 462500, growth: 8.7 },
  { name: 'iPad Pro', sales: 680, revenue: 544000, growth: -2.3 },
  { name: 'Apple Watch', sales: 1120, revenue: 448000, growth: 12.8 }
];

const customerSegments = [
  { segment: 'Premium', value: 35, color: '#3b82f6', customers: 820 },
  { segment: 'Standard', value: 45, color: '#10b981', customers: 1058 },
  { segment: 'Basic', value: 20, color: '#f59e0b', customers: 472 }
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 text-lg">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 days
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          
          return (
            <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="flex items-center mt-2">
                  {isPositive ? (
                    <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{stat.change}%
                  </span>
                  <span className="text-sm text-slate-500 ml-2">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Charts and Analytics Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue and Analytics Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  Revenue Overview
                </CardTitle>
                <CardDescription>
                  Monthly revenue trends and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales by Category */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                    <PieChart className="h-4 w-4 text-white" />
                  </div>
                  Sales by Category
                </CardTitle>
                <CardDescription>
                  Product category distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }} 
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Orders and User Analytics */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Orders Trend */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  Orders & Users Growth
                </CardTitle>
                <CardDescription>
                  Monthly orders and user acquisition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="users" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Analytics */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  Device Usage
                </CardTitle>
                <CardDescription>
                  User device preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceData.map((device) => (
                    <div key={device.device} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: device.color }} />
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${device.users}%`, 
                              backgroundColor: device.color 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{device.users}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Laptop className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-medium text-blue-900">Desktop</div>
                    <div className="text-xs text-blue-600">45% Users</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <Smartphone className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-sm font-medium text-purple-900">Mobile</div>
                    <div className="text-xs text-purple-600">35% Users</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Globe className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <div className="text-sm font-medium text-green-900">Tablet</div>
                    <div className="text-xs text-green-600">20% Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Traffic Sources */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                  <Target className="h-4 w-4 text-white" />
                </div>
                Traffic Sources
              </CardTitle>
              <CardDescription>
                Where your visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  {trafficSources.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-${['blue', 'purple', 'green', 'yellow', 'red'][index]}-500`} />
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{source.visits.toLocaleString()}</div>
                        <div className="text-sm text-slate-500">{source.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Pie
                      data={trafficSources.map((item, index) => ({
                        ...item,
                        color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index]
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="visits"
                    >
                      {trafficSources.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }} 
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Metrics */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  Live Visitors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">247</div>
                <p className="text-sm text-slate-500 mt-1">Active users right now</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-slate-600">Live</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">3.2%</div>
                <p className="text-sm text-slate-500 mt-1">From all visitors</p>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">+0.3% from last week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  Avg. Order Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">$89.50</div>
                <p className="text-sm text-slate-500 mt-1">Per transaction</p>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">+$12.30 from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="space-y-6">
            {/* Primary Revenue Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Detailed Revenue Analysis</CardTitle>
                <CardDescription>Comprehensive revenue breakdown and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    Revenue vs Target
                  </CardTitle>
                  <CardDescription>
                    Monthly revenue compared to targets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={revenueData.map(item => ({ ...item, target: item.revenue * 1.2 }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: 'none', 
                          borderRadius: '8px', 
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    Revenue Growth Rate
                  </CardTitle>
                  <CardDescription>
                    Month-over-month growth percentage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData.map((item, index) => ({
                      ...item,
                      growth: index === 0 ? 0 : ((item.revenue - revenueData[index - 1].revenue) / revenueData[index - 1].revenue) * 100
                    }))}>
                      <defs>
                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: 'none', 
                          borderRadius: '8px', 
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                        }} 
                        formatter={(value) => [`${typeof value === 'number' ? value.toFixed(1) : value}%`, 'Growth Rate']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="growth" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorGrowth)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="space-y-6">
            {/* User Analytics Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>User Analytics Overview</CardTitle>
                <CardDescription>User growth and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorUsers)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Monthly Comparison */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                      <BarChart3 className="h-4 w-4 text-white" />
                    </div>
                    Monthly Comparison
                  </CardTitle>
                  <CardDescription>
                    Key metrics comparison with last month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyComparison.map((item) => (
                      <div key={item.metric} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                          <div>
                            <div className="font-medium">{item.metric}</div>
                            <div className="text-sm text-slate-500">This month</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{item.thisMonth.toLocaleString()}</div>
                          <div className={`text-sm flex items-center gap-1 ${item.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.growth > 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {item.growth > 0 ? '+' : ''}{item.growth}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Activity Heatmap */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    User Activity Trends
                  </CardTitle>
                  <CardDescription>
                    Daily active users pattern
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="hour" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: 'none', 
                          borderRadius: '8px', 
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="space-y-6">
            {/* Product Performance Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Product Performance Overview</CardTitle>
                <CardDescription>Sales trends and product analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis yAxisId="left" stroke="#64748b" />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }} 
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Products and Customer Segments */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Top Products */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    Top Products
                  </CardTitle>
                  <CardDescription>
                    Best performing products this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={product.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-slate-500">{product.sales} sales</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${product.revenue.toLocaleString()}</div>
                          <div className={`text-sm flex items-center gap-1 ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.growth > 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {product.growth > 0 ? '+' : ''}{product.growth}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Segments */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    Customer Segments
                  </CardTitle>
                  <CardDescription>
                    Customer distribution by segment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPieChart>
                        <Pie
                          data={customerSegments}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {customerSegments.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                          }} 
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>

                    <div className="space-y-3">
                      {customerSegments.map((segment) => (
                        <div key={segment.segment} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }} />
                            <span className="font-medium">{segment.segment}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{segment.customers}</div>
                            <div className="text-sm text-slate-500">{segment.value}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Advanced Analytics Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sales Funnel */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  Sales Funnel
                </CardTitle>
                <CardDescription>
                  Customer journey conversion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <FunnelChart data={salesFunnelData}>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }} 
                    />
                    <Funnel
                      dataKey="value"
                      data={salesFunnelData}
                      isAnimationActive
                    >
                      {salesFunnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList position="center" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Radar */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Website performance analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={performanceData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Hourly Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                Hourly Activity
              </CardTitle>
              <CardDescription>
                User activity and sales throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis yAxisId="left" stroke="#64748b" />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                    }} 
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                Geographic Distribution
              </CardTitle>
              <CardDescription>
                Sales by country and region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  {geographicData.map((item, index) => (
                    <div key={item.country} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                          index === 0 ? 'from-blue-500 to-cyan-600' :
                          index === 1 ? 'from-purple-500 to-pink-600' :
                          index === 2 ? 'from-green-500 to-emerald-600' :
                          index === 3 ? 'from-yellow-500 to-orange-600' :
                          'from-red-500 to-pink-600'
                        }`} />
                        <span className="font-medium">{item.country}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${item.sales.toLocaleString()}</div>
                        <div className="text-sm text-slate-500">{item.users}% users</div>
                      </div>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={geographicData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis type="category" dataKey="country" stroke="#64748b" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }} 
                    />
                    <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="col-span-full lg:col-span-4 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-white" />
              </div>
              Recent Orders
            </CardTitle>
            <CardDescription>
              You have {recentOrders.length} orders this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {order.customer.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="font-medium text-slate-900">{order.customer}</div>
                      <div className="text-sm text-slate-500">{order.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium text-slate-900">{order.amount}</div>
                      <div className="text-sm text-slate-500">{order.id}</div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "capitalize",
                        order.status === 'delivered' && "bg-green-100 text-green-800",
                        order.status === 'processing' && "bg-blue-100 text-blue-800",
                        order.status === 'shipped' && "bg-purple-100 text-purple-800",
                        order.status === 'pending' && "bg-yellow-100 text-yellow-800",
                        order.status === 'cancelled' && "bg-red-100 text-red-800"
                      )}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="col-span-full lg:col-span-3 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Quick Stats
            </CardTitle>
            <CardDescription>
              Overview of your store performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Sales Goal</span>
                <span>$12,000 / $15,000</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Customer Satisfaction</span>
                <span>4.8/5.0</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Product Ratings</span>
                <span>4.6/5.0</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">Top Product Category</span>
              </div>
              <div className="text-2xl font-bold">Electronics</div>
              <div className="text-sm text-slate-500">
                <TrendingUp className="inline mr-1 h-3 w-3" />
                +15% this month
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
