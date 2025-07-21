import { useState } from 'react';
import { Package, CheckCircle, Clock, Calendar, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useEffect } from 'react';
import axios from 'axios';

interface UserPlan {
  id: string;
  userId: string;
  planId: number;
  planName: string;
  startDate: string;
  endDate: string;
  remainPosts: number;
  remainPushes: number;
  isActive: boolean;
}

const users = [
  {
    id: '2c2cd722-b179-4272-8bf9-de60fe0d0e95',
    name: 'Nguyễn Văn A',
    email: 'a@example.com',
  },
  {
    id: '12357369-cf0d-4b51-a4b4-608e9ef01928',
    name: 'Trần Thị B',
    email: 'b@example.com',
  },
  {
    id: '1545c40b-f574-47d8-a187-41a0a0011781',
    name: 'Lê Văn C',
    email: 'c@example.com',
  },
];

function getUserNameById(userId: string): string {
  const user = users.find((u) => u.id === userId);
  return user?.name || 'Unknown';
}

function getUserEmailById(userId: string): string {
  const user = users.find((u) => u.id === userId);
  return user?.email || '';
}

function getPlanPrice(planId: number): number {
  switch (planId) {
    case 1:
      return 10; // BASIC
    case 2:
      return 39000; // INTERMEDIATE
    case 3:
      return 59000; // ADVANCED
    default:
      return 0;
  }
}
const PLAN_PRICING: Record<number, number> = {
  1: 10,
  2: 39000,
  3: 59000,
};

// interface Order {
//   id: string;
//   customer: {
//     name: string;
//     email: string;
//     phone?: string;
//   };
//   items: Array<{
//     id: string;
//     name: string;
//     quantity: number;
//     price: number;
//     image?: string;
//   }>;
//   total: number;
//   status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
//   shippingAddress: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };
//   createdAt: string;
//   updatedAt: string;
//   trackingNumber?: string;
// }

// const sampleOrders: Order[] = [
//   {
//     id: 'ORD-001',
//     customer: {
//       name: 'John Doe',
//       email: 'john@example.com',
//       phone: '+1234567890'
//     },
//     items: [
//       {
//         id: '1',
//         name: 'Wireless Bluetooth Headphones',
//         quantity: 1,
//         price: 299.99,
//         image: '/products/headphones.jpg'
//       },
//       {
//         id: '2',
//         name: 'Phone Case',
//         quantity: 2,
//         price: 19.99
//       }
//     ],
//     total: 339.97,
//     status: 'processing',
//     paymentStatus: 'paid',
//     shippingAddress: {
//       street: '123 Main St',
//       city: 'New York',
//       state: 'NY',
//       zipCode: '10001',
//       country: 'USA'
//     },
//     createdAt: '2024-01-20T10:30:00Z',
//     updatedAt: '2024-01-20T14:15:00Z',
//     trackingNumber: 'TRK123456789'
//   },
//   {
//     id: 'ORD-002',
//     customer: {
//       name: 'Jane Smith',
//       email: 'jane@example.com',
//       phone: '+1234567891'
//     },
//     items: [
//       {
//         id: '3',
//         name: 'Smart Watch Pro',
//         quantity: 1,
//         price: 399.99
//       }
//     ],
//     total: 399.99,
//     status: 'shipped',
//     paymentStatus: 'paid',
//     shippingAddress: {
//       street: '456 Oak Ave',
//       city: 'Los Angeles',
//       state: 'CA',
//       zipCode: '90210',
//       country: 'USA'
//     },
//     createdAt: '2024-01-19T09:15:00Z',
//     updatedAt: '2024-01-20T11:30:00Z',
//     trackingNumber: 'TRK987654321'
//   },
//   {
//     id: 'ORD-003',
//     customer: {
//       name: 'Bob Johnson',
//       email: 'bob@example.com'
//     },
//     items: [
//       {
//         id: '4',
//         name: 'Organic Cotton T-Shirt',
//         quantity: 3,
//         price: 29.99
//       }
//     ],
//     total: 89.97,
//     status: 'delivered',
//     paymentStatus: 'paid',
//     shippingAddress: {
//       street: '789 Pine St',
//       city: 'Chicago',
//       state: 'IL',
//       zipCode: '60601',
//       country: 'USA'
//     },
//     createdAt: '2024-01-18T16:45:00Z',
//     updatedAt: '2024-01-19T10:20:00Z',
//     trackingNumber: 'TRK456789123'
//   },
//   {
//     id: 'ORD-004',
//     customer: {
//       name: 'Alice Brown',
//       email: 'alice@example.com',
//       phone: '+1234567892'
//     },
//     items: [
//       {
//         id: '5',
//         name: 'Gaming Mechanical Keyboard',
//         quantity: 1,
//         price: 149.99
//       }
//     ],
//     total: 149.99,
//     status: 'cancelled',
//     paymentStatus: 'refunded',
//     shippingAddress: {
//       street: '321 Elm St',
//       city: 'Miami',
//       state: 'FL',
//       zipCode: '33101',
//       country: 'USA'
//     },
//     createdAt: '2024-01-17T13:20:00Z',
//     updatedAt: '2024-01-18T09:45:00Z'
//   },
//   {
//     id: 'ORD-005',
//     customer: {
//       name: 'Charlie Wilson',
//       email: 'charlie@example.com'
//     },
//     items: [
//       {
//         id: '6',
//         name: 'Yoga Mat Premium',
//         quantity: 1,
//         price: 49.99
//       }
//     ],
//     total: 49.99,
//     status: 'pending',
//     paymentStatus: 'pending',
//     shippingAddress: {
//       street: '654 Maple Ave',
//       city: 'Seattle',
//       state: 'WA',
//       zipCode: '98101',
//       country: 'USA'
//     },
//     createdAt: '2024-01-20T15:30:00Z',
//     updatedAt: '2024-01-20T15:30:00Z'
//   }
// ];

// const getStatusColor = (status: Order['status']) => {
//   switch (status) {
//     case 'pending': return 'bg-yellow-100 text-yellow-800';
//     case 'confirmed': return 'bg-blue-100 text-blue-800';
//     case 'processing': return 'bg-purple-100 text-purple-800';
//     case 'shipped': return 'bg-indigo-100 text-indigo-800';
//     case 'delivered': return 'bg-green-100 text-green-800';
//     case 'cancelled': return 'bg-red-100 text-red-800';
//     default: return 'bg-gray-100 text-gray-800';
//   }
// };

// const getPaymentStatusColor = (paymentStatus: Order['paymentStatus']) => {
//   switch (paymentStatus) {
//     case 'paid': return 'bg-green-100 text-green-800';
//     case 'pending': return 'bg-yellow-100 text-yellow-800';
//     case 'failed': return 'bg-red-100 text-red-800';
//     case 'refunded': return 'bg-gray-100 text-gray-800';
//     default: return 'bg-gray-100 text-gray-800';
//   }
// };

// const getStatusIcon = (status: Order['status']) => {
//   switch (status) {
//     case 'pending': return <Clock className="h-4 w-4" />;
//     case 'confirmed': return <CheckCircle className="h-4 w-4" />;
//     case 'processing': return <Package className="h-4 w-4" />;
//     case 'shipped': return <Truck className="h-4 w-4" />;
//     case 'delivered': return <CheckCircle className="h-4 w-4" />;
//     case 'cancelled': return <X className="h-4 w-4" />;
//     default: return <Clock className="h-4 w-4" />;
//   }
// };

export default function OrdersManagement() {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Gọi API lấy danh sách Plan
  useEffect(() => {
    fetchUserPlans();
  }, []);

  const fetchUserPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<UserPlan[]>('https://localhost:7007/api/plan/users');
      if (!response.data || !Array.isArray(response.data)) {
        console.log('Invalid data format');
      }

      setUserPlans(response.data);
    } catch (err: any) {
      console.error('Failed to fetch user plans:', err);
      setError('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const totalPlans = userPlans.length;
  const basicCount = userPlans.filter((p) => p.planId === 2).length;
  const advancedCount = userPlans.filter((p) => p.planId === 3).length;

  const totalRevenue = userPlans.reduce((sum, plan) => {
    const price = PLAN_PRICING[plan.planId] || 0;
    return sum + price;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lí ...</h1>
          <p className="text-muted-foreground">Theo dõi trạng thái gói của người dùng.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Filter by Date
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số gói</CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlans}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gói BASIC</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{basicCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gói ADVANCED</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advancedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card> */}

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle> Các gói người dùng đăng kí</CardTitle>
          {/* <CardDescription>
            A list of all orders in your store.
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Gói đã đăng kí</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Lượt đăng còn lại</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{getUserNameById(plan.userId)}</div>
                      <div className="text-muted-foreground text-sm">
                        {getUserEmailById(plan.userId)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{plan.planName}</TableCell>
                  <TableCell>{getPlanPrice(plan.planId)}$</TableCell>
                  <TableCell>{plan.remainPosts}</TableCell>
                  <TableCell>{new Date(plan.startDate).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{new Date(plan.endDate).toLocaleDateString('vi-VN')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
