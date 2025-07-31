import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Users,
  UserPlus,
  Filter,
  Download,
  Eye,
  TrendingUp,
  Activity,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { authApi } from '@/apis/auth';
import { planAPI, type UserPlanResponse, getPlanBadgeColor } from '@/apis/plan';

interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
  isVerify: boolean;
  isActive: boolean;
}

interface UserWithPlan extends User {
  userPlan?: UserPlanResponse;
}

const getRoleColor = (isVerify: boolean) => {
  return isVerify ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
};

const getStatusColor = (isActive: boolean) => {
  return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

const USERS_PER_PAGE = 6;

export default function UsersManagement() {
  const [users, setUsers] = useState<UserWithPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithPlan | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await authApi.getAllProfile();
        console.log('Fetched users:', response);

        let userData: User[] = [];
        if (response?.data) {
          userData = response.data;
        } else if (Array.isArray(response)) {
          userData = response;
        }
        console.log('Processed user data:', userData);
        // Hiển thị users ngay lập tức (không có plans)
        const initialUsers: UserWithPlan[] = userData.map((user) => ({
          ...user,
          userPlan: undefined,
        }));
        setUsers(initialUsers);
        setLoading(false);

        // Fetch plans cho từng user một cách bất đồng bộ
        const fetchUserPlans = async () => {
          for (let i = 0; i < userData.length; i++) {
            const user = userData[i];
            try {
              console.log(`Fetching plan for user: ${user.id}`);
              const userPlans = await planAPI.getUserPlans(user.id);
              console.log(`User ${user.id} plans:`, userPlans);

              // Get the active plan or the first plan
              const activePlan =
                userPlans && userPlans.length > 0
                  ? userPlans.find((plan) => plan.isActive) || userPlans[0]
                  : undefined;

              // Update specific user with plan data
              setUsers((prevUsers) =>
                prevUsers.map((prevUser) =>
                  prevUser.id === user.id
                    ? ({ ...prevUser, userPlan: activePlan } as UserWithPlan)
                    : prevUser
                )
              );
            } catch (error) {
              console.error(`Failed to fetch plan for user ${user.id}:`, error);
              // Không cần làm gì, user vẫn giữ userPlan: undefined
            }

            // Delay nhỏ để tránh spam API
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        };

        // Chạy fetch plans trong background
        fetchUserPlans();
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerification =
      selectedVerification === 'all' ||
      (selectedVerification === 'verified' && user.isVerify) ||
      (selectedVerification === 'unverified' && !user.isVerify);
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && user.isActive) ||
      (selectedStatus === 'inactive' && !user.isActive);

    return matchesSearch && matchesVerification && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedVerification, selectedStatus]);

  const handleStatusChange = async (userId: string, newStatus: boolean) => {
    try {
      await authApi.updateUserStatus(userId, newStatus);
      setUsers(users.map((user) => (user.id === userId ? { ...user, isActive: newStatus } : user)));
      console.log(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const UserDetailDialog = ({ user }: { user: UserWithPlan }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>User Details</DialogTitle>
        <DialogDescription>Detailed information about {user.userName}</DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="plan">Plan Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} alt={user.userName} />
              <AvatarFallback>
                {user.userName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.userName}</h3>
              <div className="flex items-center gap-2">
                <Badge className={getRoleColor(user.isVerify)}>
                  {user.isVerify ? 'Verified' : 'Unverified'}
                </Badge>
                <Badge className={getStatusColor(user.isActive)}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {user.userPlan && (
                  <Badge className={getPlanBadgeColor(user.userPlan.planName)}>
                    {user.userPlan.planName}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">{user.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Created At</span>
                  <span className="text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Last Updated</span>
                  <span className="text-sm font-medium">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Birth Date</span>
                  <span className="text-sm font-medium">
                    {user.birthDate
                      ? new Date(user.birthDate).toLocaleDateString()
                      : 'Not provided'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="text-muted-foreground py-8 text-center">
            Activity history will be displayed here
          </div>
        </TabsContent>

        <TabsContent value="plan">
          <div className="space-y-4">
            {user.userPlan ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Plan: {user.userPlan.planName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan Status</span>
                    <Badge
                      className={
                        user.userPlan.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {user.userPlan.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date</span>
                    <span>{new Date(user.userPlan.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date</span>
                    <span>{new Date(user.userPlan.endDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                No active plan found for this user
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="text-muted-foreground mt-2">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">
            Manage your platform users, roles, and permissions.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedVerification} onValueChange={setSelectedVerification}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>A list of all users in your platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.userName} />
                        <AvatarFallback>
                          {user.userName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.userName}</div>
                        <div className="text-muted-foreground text-sm">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.isVerify)}>
                      {user.isVerify ? 'Verified' : 'Unverified'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.isActive)}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.userPlan ? (
                      <div className="space-y-1">
                        <Badge className={getPlanBadgeColor(user.userPlan.planName)}>
                          {user.userPlan.planName}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No Plan</span>
                    )}
                  </TableCell>
                  <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setSelectedUser(user);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          {selectedUser && <UserDetailDialog user={selectedUser} />}
                        </Dialog>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(user.id, true)}
                          disabled={user.isActive}
                        >
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(user.id, false)}
                          disabled={!user.isActive}
                          className="text-orange-600"
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-muted-foreground text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of{' '}
              {filteredUsers.length} users
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
