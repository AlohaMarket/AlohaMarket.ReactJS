import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/apis/post';
import { Clock, ArrowRight, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { PostValidationStatusBadge } from '@/components/common/PostValidationStatusBadge';
import { PostStatus } from '@/types/post.type';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import type { PostListResponse, UserPostFilters } from '@/types/post.type';
import type { PaginatedResponse } from '@/types';

export default function MyPostsPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Chuyển đổi activeTab sang PostStatus
    const getStatusFromTab = (tab: string): PostStatus | undefined => {
        switch (tab) {
            case 'pending': return PostStatus.PendingValidation;
            case 'valid': return PostStatus.Validated;
            case 'invalid': return PostStatus.Invalid;
            case 'archived': return PostStatus.Archived;
            default: return undefined; // 'all' hoặc tab khác
        }
    };

    // Lấy dữ liệu với paging và filter
    const {
        data: postsData,
        isLoading,
        error,
        refetch
    } = useQuery<PaginatedResponse<PostListResponse>>({
        queryKey: ['my-posts', activeTab, page],
        queryFn: () => postsApi.getMyPosts({
            page,
            pageSize,
            status: getStatusFromTab(activeTab)
        } as UserPostFilters),
        staleTime: 60 * 1000 // 1 minute
    });

    // Reset trang khi chuyển tab
    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    // Scroll to top when changing page
    const scrollToTop = () => {
        const element = document.querySelector('.bg-white.rounded-xl.shadow-sm.overflow-hidden');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Handle page change with scroll
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        scrollToTop();
    };

    // Refresh post list periodically to check validation status
    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [refetch]);

    // Lấy posts từ response
    const posts = postsData?.items || [];
    const pagination = postsData?.meta;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bài đăng của tôi</h1>
                    <p className="text-gray-600 mt-2">Quản lý và theo dõi trạng thái kiểm duyệt các bài đăng của bạn</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Quản lý bài đăng</h2>
                            <p className="text-sm text-gray-600">Xem và theo dõi trạng thái kiểm duyệt bài đăng của bạn</p>
                        </div>
                        <Button onClick={() => navigate('/create-post')}>
                            Đăng bài mới
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Các bài đăng của tôi</h3>
                        </div>

                        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="p-6">
                            <TabsList>
                                <TabsTrigger value="all">Tất cả</TabsTrigger>
                                <TabsTrigger value="pending">Đang kiểm duyệt</TabsTrigger>
                                <TabsTrigger value="valid">Đã duyệt</TabsTrigger>
                                <TabsTrigger value="invalid">Không hợp lệ</TabsTrigger>
                                <TabsTrigger value="archived">Đã bán</TabsTrigger>
                            </TabsList>
                            <Separator className="my-4" />

                            {/* Single TabsContent since we're fetching based on active tab */}
                            <TabsContent value={activeTab} className="mt-0">
                                {renderPosts(posts, isLoading, error, navigate)}

                                {/* Pagination */}
                                {pagination && pagination.total_pages > 1 && (
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
                                                <span className="sr-only">Previous page</span>
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
                                                {Array.from(
                                                    { length: Math.min(5, pagination.total_pages) },
                                                    (_, i) => {
                                                        let pageNum;

                                                        if (page <= 3) {
                                                            // At the beginning
                                                            pageNum = i + 1;
                                                            if (pageNum > pagination.total_pages) return null;
                                                        } else if (page >= pagination.total_pages - 2) {
                                                            // At the end
                                                            pageNum = pagination.total_pages - 4 + i;
                                                            if (pageNum < 1) return null;
                                                        } else {
                                                            // In the middle
                                                            pageNum = page - 2 + i;
                                                            if (pageNum < 1 || pageNum > pagination.total_pages) return null;
                                                        }

                                                        return (
                                                            <Button
                                                                key={pageNum}
                                                                variant={page === pageNum ? "outline" : "secondary"}
                                                                size="sm"
                                                                className={`h-9 w-9 rounded-md ${page === pageNum ? "border-blue-600 text-blue-600 font-bold" : ""}`}
                                                                onClick={() => handlePageChange(pageNum)}
                                                            >
                                                                {pageNum}
                                                            </Button>
                                                        );
                                                    }
                                                )}

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
                                                <span className="sr-only">Next page</span>
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </nav>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

function renderPosts(
    posts: PostListResponse[],
    isLoading: boolean,
    error: Error | null,
    navigate: (path: string) => void
) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Không thể tải bài đăng</p>
                <p className="text-gray-600 mb-4">Đã xảy ra lỗi khi tải bài đăng của bạn.</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Tải lại
                </Button>
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">Chưa có bài đăng nào</p>
                <p className="text-gray-600 mb-4">Bạn chưa có bài đăng nào trong mục này.</p>
                <Button onClick={() => navigate('/create-post')}>
                    Đăng bài mới
                </Button>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {posts.map(post => (
                <div key={post.id} className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        {/* Image */}
                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            {post.image ? (
                                <img src={post.image.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <span className="text-gray-400 text-xs">No image</span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                            <div className="flex items-start justify-between">
                                <h4 className="font-medium text-lg text-gray-900 line-clamp-1">{post.title}</h4>
                                {post.status !== undefined && (
                                    <PostValidationStatusBadge status={post.status} />
                                )}
                            </div>

                            <p className="text-gray-600 text-sm line-clamp-2 mt-1 mb-3">{post.description}</p>

                            <div className="flex items-center justify-between">
                                <span className="text-blue-600 font-semibold">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                        notation: 'compact'
                                    }).format(post.price)}
                                </span>

                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => navigate(`/post/${post.id}`)}>
                                        Xem
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => navigate(`/post/${post.id}/status`)}>
                                        Kiểm tra trạng thái
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
