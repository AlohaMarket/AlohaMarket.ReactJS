import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postsApi } from '@/apis/post';
import { PostStatus } from '@/types/post.type';
import type { PostListResponse } from '@/types/post.type';
import type { PaginatedResponse } from '@/types';
import { PostValidationStatusBadge } from '@/components/common/PostValidationStatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
    Clock,
    AlertTriangle,
    CheckCircle,
    Eye,
    Search,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Ban,
    Archive,
    Trash2,
    RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';

const getStatusFromTab = (tab: string): PostStatus | undefined => {
    switch (tab) {
        case 'pending': return PostStatus.PendingValidation;
        case 'validated': return PostStatus.Validated;
        case 'invalid': return PostStatus.Invalid;
        case 'archived': return PostStatus.Archived;
        case 'rejected': return PostStatus.Rejected;
        default: return undefined; // 'all' or 'violations'
    }
};

const getStatusColor = (status: PostStatus) => {
    switch (status) {
        case PostStatus.Validated:
            return 'bg-green-100 text-green-800';
        case PostStatus.PendingValidation:
            return 'bg-yellow-100 text-yellow-800';
        case PostStatus.Invalid:
        case PostStatus.Rejected:
            return 'bg-red-100 text-red-800';
        case PostStatus.Archived:
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getStatusIcon = (status: PostStatus) => {
    switch (status) {
        case PostStatus.Validated:
            return <CheckCircle className="w-4 h-4 text-green-600" />;
        case PostStatus.PendingValidation:
            return <Clock className="w-4 h-4 text-yellow-600" />;
        case PostStatus.Invalid:
        case PostStatus.Rejected:
            return <AlertTriangle className="w-4 h-4 text-red-600" />;
        case PostStatus.Archived:
            return <Archive className="w-4 h-4 text-gray-600" />;
        default:
            return <Clock className="w-4 h-4 text-gray-600" />;
    }
};

export default function PostsManagement() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPost, setSelectedPost] = useState<PostListResponse | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const pageSize = 20;

    // Get posts data based on active tab
    const {
        data: postsData,
        isLoading,
        error,
        refetch
    } = useQuery<PaginatedResponse<PostListResponse>>({
        queryKey: ['admin-posts', activeTab, page, searchTerm],
        queryFn: () => {
            if (activeTab === 'violations') {
                return postsApi.getViolationPosts(page, pageSize);
            } else {
                return postsApi.getPostsByStatus(getStatusFromTab(activeTab), page, pageSize);
            }
        },
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: activeTab === 'pending' ? 30 * 1000 : false // Auto refresh for pending posts
    });

    // Get post statistics
    const {
        data: statsData,
        refetch: refetchStats
    } = useQuery({
        queryKey: ['admin-post-statistics'],
        queryFn: () => postsApi.getPostStatistics(),
        staleTime: 60 * 1000, // 1 minute
        refetchInterval: 60 * 1000, // Refresh every minute
    });

    // Centralized function to refresh both posts and statistics
    const refreshAllData = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([refetch(), refetchStats()]);
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsRefreshing(false);
        }
    }, [refetch, refetchStats]);

    // Reset page when changing tabs
    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    // Auto refresh for pending posts and violations
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeTab === 'pending' || activeTab === 'violations') {
            interval = setInterval(() => {
                refreshAllData(); // Refresh both posts and statistics
            }, 30000); // 30 seconds
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [activeTab, refreshAllData]);

    const posts = postsData?.items || [];
    const pagination = postsData?.meta;

    // Use real stats data or fallback to sample data
    const stats = statsData || {
        total: 0,
        pending: 0,
        validated: 0,
        invalid: 0,
        rejected: 0,
        archived: 0,
        violation: 0
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRefresh = () => {
        refreshAllData();
    };

    const handleViewPost = (postId: string) => {
        navigate(`/post/${postId}`);
    };

    const handleViewPostDetails = (post: PostListResponse) => {
        setSelectedPost(post);
    };

    // Post action handlers - implement actual API calls
    const handleApprovePost = async (postId: string) => {
        try {
            console.log('Approve post:', postId);
            // TODO: Implement approve post API call
            refreshAllData();
        } catch (error) {
            console.error('Error approving post:', error);
        }
    };

    const handleRejectPost = async (postId: string) => {
        try {
            console.log('Reject post:', postId);
            // TODO: Implement reject post API call
            refreshAllData();
        } catch (error) {
            console.error('Error rejecting post:', error);
        }
    };

    const handleArchivePost = async (postId: string) => {
        try {
            console.log('Archive post:', postId);
            // TODO: Implement archive post API call
            refreshAllData();
        } catch (error) {
            console.error('Error archiving post:', error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            const confirmed = window.confirm('Bạn có chắc chắn muốn xóa bài đăng này không? Hành động này không thể hoàn tác.');
            if (!confirmed) return;

            await postsApi.deletePost(postId);
            console.log('Post deleted successfully:', postId);
            alert('Bài đăng đã được xóa thành công!');
            refreshAllData(); // Refresh both posts and statistics
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Có lỗi xảy ra khi xóa bài đăng. Vui lòng thử lại.');
        }
    };

    const handleRecoveryViolationPost = async (postId: string) => {
        try {
            const confirmed = window.confirm('Bạn có chắc chắn muốn khôi phục bài đăng này khỏi trạng thái vi phạm không?');
            if (!confirmed) return;

            await postsApi.recoveryViolationPost(postId);
            console.log('Post recovered from violation successfully:', postId);
            alert('Bài đăng đã được khôi phục thành công!');
            refreshAllData(); // Refresh both posts and statistics
        } catch (error) {
            console.error('Error recovering violation post:', error);
            alert('Có lỗi xảy ra khi khôi phục bài đăng. Vui lòng thử lại.');
        }
    };

    const PostDetailDialog = ({ post }: { post: PostListResponse }) => (
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-50">
            <DialogHeader>
                <DialogTitle>Chi tiết bài đăng</DialogTitle>
                <DialogDescription>
                    Thông tin chi tiết về bài đăng: {post.title}
                </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Post Image */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {post.image?.imageUrl ? (
                            <img
                                src={post.image.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Không có hình ảnh
                            </div>
                        )}
                    </div>
                </div>

                {/* Post Details */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: post.currency || 'VND'
                            }).format(post.price)}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                            <PostValidationStatusBadge status={post.status} />
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">ID bài đăng:</span>
                            <span className="text-sm text-gray-900">{post.id}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Ngày tạo:</span>
                            <span className="text-sm text-gray-900">
                                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Địa điểm:</span>
                            <span className="text-sm text-gray-900">
                                {[post.wardText, post.districtText, post.provinceText]
                                    .filter(Boolean)
                                    .join(', ') || 'Không xác định'}
                            </span>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <span className="text-sm font-medium text-gray-500">Mô tả:</span>
                        <p className="text-sm text-gray-900 mt-1">{post.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPost(post.id)}
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                        </Button>

                        {/* Actions for violation posts */}
                        {activeTab === 'violations' && (
                            <>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleRecoveryViolationPost(post.id)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Khôi phục
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeletePost(post.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Xóa
                                </Button>
                            </>
                        )}

                        {/* Actions for pending posts */}
                        {post.status === PostStatus.PendingValidation && activeTab !== 'violations' && (
                            <>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleApprovePost(post.id)}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Duyệt
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRejectPost(post.id)}
                                >
                                    <Ban className="w-4 h-4 mr-2" />
                                    Từ chối
                                </Button>
                            </>
                        )}

                        {/* Archive action for non-violation posts */}
                        {activeTab !== 'violations' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleArchivePost(post.id)}
                            >
                                <Archive className="w-4 h-4 mr-2" />
                                Lưu trữ
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </DialogContent>
    );

    const renderPostsTable = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-12">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Lỗi tải dữ liệu</h3>
                        <p className="text-red-600 mb-4">Không thể tải danh sách bài đăng</p>
                        <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Đang thử lại...' : 'Thử lại'}
                        </Button>
                    </div>
                </div>
            );
        }

        if (posts.length === 0) {
            return (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Clock className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có bài đăng</h3>
                    <p className="text-gray-600">
                        {activeTab === 'violations'
                            ? 'Không có bài đăng vi phạm nào'
                            : 'Không có bài đăng nào trong danh mục này'}
                    </p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Bài đăng</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Địa điểm</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow
                                key={post.id}
                                className={activeTab === 'violations' ? 'bg-red-50 border-red-200' : ''}
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                            {post.image?.imageUrl ? (
                                                <img
                                                    src={post.image.imageUrl}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                    No img
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-medium text-gray-900 truncate">
                                                {post.title}
                                            </h4>
                                            <p className="text-sm text-gray-500 truncate">
                                                ID: {post.id}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-medium text-green-600">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: post.currency || 'VND'
                                        }).format(post.price)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(post.status)}
                                        <Badge
                                            variant="outline"
                                            className={
                                                activeTab === 'violations'
                                                    ? 'bg-red-100 text-red-800 border-red-300'
                                                    : getStatusColor(post.status)
                                            }
                                        >
                                            {activeTab === 'violations' && 'Vi phạm'}
                                            {activeTab !== 'violations' && post.status === PostStatus.PendingValidation && 'Đang kiểm duyệt'}
                                            {activeTab !== 'violations' && post.status === PostStatus.Validated && 'Đã duyệt'}
                                            {activeTab !== 'violations' && post.status === PostStatus.Invalid && 'Không hợp lệ'}
                                            {activeTab !== 'violations' && post.status === PostStatus.Rejected && 'Đã từ chối'}
                                            {activeTab !== 'violations' && post.status === PostStatus.Archived && 'Đã bán'}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600">
                                        {[post.districtText, post.provinceText]
                                            .filter(Boolean)
                                            .join(', ') || 'N/A'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600">
                                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleViewPost(post.id)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Xem chi tiết
                                            </DropdownMenuItem>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => {
                                                        e.preventDefault();
                                                        handleViewPostDetails(post);
                                                    }}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Xem thông tin
                                                    </DropdownMenuItem>
                                                </DialogTrigger>
                                                {selectedPost && <PostDetailDialog post={selectedPost} />}
                                            </Dialog>
                                            <DropdownMenuSeparator />

                                            {/* Actions for violation posts */}
                                            {activeTab === 'violations' && (
                                                <>
                                                    <DropdownMenuItem onClick={() => handleRecoveryViolationPost(post.id)}>
                                                        <RotateCcw className="mr-2 h-4 w-4" />
                                                        Khôi phục
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeletePost(post.id)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Xóa bài đăng
                                                    </DropdownMenuItem>
                                                </>
                                            )}

                                            {/* Actions for pending posts */}
                                            {post.status === PostStatus.PendingValidation && activeTab !== 'violations' && (
                                                <>
                                                    <DropdownMenuItem onClick={() => handleApprovePost(post.id)}>
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Duyệt bài
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleRejectPost(post.id)}>
                                                        <Ban className="mr-2 h-4 w-4" />
                                                        Từ chối
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                </>
                                            )}

                                            {/* Archive and delete actions for non-violation posts */}
                                            {activeTab !== 'violations' && (
                                                <>
                                                    <DropdownMenuItem onClick={() => handleArchivePost(post.id)}>
                                                        <Archive className="mr-2 h-4 w-4" />
                                                        Lưu trữ
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeletePost(post.id)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Xóa
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    const renderPagination = () => {
        if (!pagination || pagination.total_pages <= 1) return null;

        return (
            <div className="flex justify-center mt-6">
                <nav className="flex items-center gap-1" aria-label="Pagination">
                    {/* Previous page button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-md"
                        onClick={() => handlePageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                        {/* First page */}
                        {page > 3 && (
                            <>
                                <Button
                                    variant={page === 1 ? "default" : "outline"}
                                    size="sm"
                                    className="h-9 w-9 rounded-md"
                                    onClick={() => handlePageChange(1)}
                                >
                                    1
                                </Button>
                                {page > 4 && (
                                    <span className="px-2 text-gray-400">...</span>
                                )}
                            </>
                        )}

                        {/* Pages around current page */}
                        {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                            let pageNum;

                            if (page <= 3) {
                                pageNum = i + 1;
                                if (pageNum > pagination.total_pages) return null;
                            } else if (page >= pagination.total_pages - 2) {
                                pageNum = pagination.total_pages - 4 + i;
                                if (pageNum < 1) return null;
                            } else {
                                pageNum = page - 2 + i;
                                if (pageNum < 1 || pageNum > pagination.total_pages) return null;
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    variant={page === pageNum ? "outline" : "secondary"}
                                    size="sm"
                                    className={`h-9 w-9 rounded-md ${page === pageNum ? "border-blue-600 text-blue-600 font-bold" : ""
                                        }`}
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}

                        {/* Last page */}
                        {page < pagination.total_pages - 2 && (
                            <>
                                {page < pagination.total_pages - 3 && (
                                    <span className="px-2 text-gray-400">...</span>
                                )}
                                <Button
                                    variant={page === pagination.total_pages ? "default" : "outline"}
                                    size="sm"
                                    className="h-9 w-9 rounded-md"
                                    onClick={() => handlePageChange(pagination.total_pages)}
                                >
                                    {pagination.total_pages}
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Next page button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-md"
                        onClick={() => handlePageChange(Math.min(pagination.total_pages, page + 1))}
                        disabled={page === pagination.total_pages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </nav>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý bài đăng</h1>
                    <p className="text-muted-foreground">
                        Xem và quản lý tất cả bài đăng trên hệ thống
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Đang làm mới...' : 'Làm mới'}
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng bài đăng</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Tất cả bài đăng
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang kiểm duyệt</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">
                            Cần duyệt
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.validated.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Đang hiển thị
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Không hợp lệ</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.invalid}</div>
                        <p className="text-xs text-muted-foreground">
                            Cần xử lý
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vi phạm</CardTitle>
                        <Ban className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.violation}</div>
                        <p className="text-xs text-muted-foreground">
                            Bị báo cáo
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Tìm kiếm bài đăng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Posts Management Tabs */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách bài đăng</CardTitle>
                    <CardDescription>
                        Quản lý và theo dõi trạng thái các bài đăng
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="all">Tất cả</TabsTrigger>
                            <TabsTrigger value="pending">
                                Đang kiểm duyệt
                                {stats.pending > 0 && (
                                    <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                                        {stats.pending}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="validated">Đã duyệt</TabsTrigger>
                            <TabsTrigger value="invalid">Không hợp lệ</TabsTrigger>
                            <TabsTrigger value="violations">
                                Vi phạm
                                {stats.violation > 0 && (
                                    <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                                        {stats.violation}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="archived">Đã bán</TabsTrigger>
                        </TabsList>

                        <Separator className="my-4" />

                        <TabsContent value={activeTab} className="mt-0">
                            {renderPostsTable()}
                            {renderPagination()}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
