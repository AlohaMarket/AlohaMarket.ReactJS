import { postsApi } from "@/apis/post"
import useQueryConfig from "@/hooks/useQueryConfig"
import type { PostFilters } from "@/types/post.type"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from 'react';
import PostCard from '@/components/common/PostCard';

import AsideFilter from "@/components/common/AsideFilter";
import SortBar from "@/components/common/SortBar";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import MobileFilterModal from "@/components/common/MobileFilterModal";
import Pagination from "@/components/common/Pagination";
import { useLocation, useNavigate } from "react-router-dom";

export default function PostListPage() {
    const queryConfig = useQueryConfig();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch posts với query config
    const { data: postsData, isLoading: postsLoading } = useQuery({
        queryKey: ['posts', queryConfig],
        queryFn: () => postsApi.getPosts(queryConfig as PostFilters),
        placeholderData: keepPreviousData,
        staleTime: 3 * 60 * 1000
    });

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [location.pathname, location.search]);

    const { nestedCategories } = useSelector((state: RootState) => state.categories);

    const posts = postsData?.items || [];
    const pagination = postsData?.meta;

    return (
        <>
            <div className="min-h-screen bg-gray-50">

                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-12 gap-6">
                        {/* Sidebar Filter - Desktop */}
                        <aside className="col-span-3 hidden lg:block">
                            <AsideFilter
                                queryConfig={queryConfig}
                                categories={nestedCategories || []}
                            />
                        </aside>

                        {/* Main Content */}
                        <main className="col-span-12 lg:col-span-9">
                            {/* Sort & View Controls */}
                            <SortBar
                                queryConfig={queryConfig}
                                totalItems={pagination?.total_items || 0}
                                currentPage={pagination?.current_page || 1}
                                totalPages={pagination?.total_pages || 1}
                                viewMode={viewMode}
                                onViewModeChange={setViewMode}
                                onShowMobileFilter={() => setShowMobileFilter(true)}
                            />

                            {/* Posts Grid/List */}
                            {postsLoading ? (
                                <PostListSkeleton viewMode={viewMode} />
                            ) : posts.length > 0 ? (
                                <>
                                    <div className={`mt-6 ${viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                                        : 'space-y-4'
                                        }`}>
                                        {posts.map((post) => (
                                            <PostCard
                                                key={post.id}
                                                post={post}
                                                layout={viewMode}
                                                onClick={() => (
                                                    navigate(`/post/${post.id}`, {
                                                        state: { from: 'post-list' }
                                                    })
                                                )}
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {pagination && pagination.total_pages > 1 && (
                                        <div className="mt-8">
                                            <Pagination
                                                queryConfig={queryConfig}
                                                pageSize={pagination.total_pages}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <EmptyState />
                            )}
                        </main>
                    </div>
                </div>

                {/* Mobile Filter Modal */}
                {showMobileFilter && (
                    <MobileFilterModal
                        queryConfig={queryConfig}
                        categories={nestedCategories || []}
                        onClose={() => setShowMobileFilter(false)}
                    />
                )}
            </div>
        </>
    );
}

// Skeleton Loading Component
function PostListSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
    return (
        <div className={`mt-6 ${viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-4'
            }`}>
            {[...Array(12)].map((_, index) => (
                <div key={index} className={`bg-white rounded-lg shadow-sm overflow-hidden animate-pulse ${viewMode === 'list' ? 'flex' : ''
                    }`}>
                    <div className={`bg-gray-200 ${viewMode === 'list' ? 'w-48 h-32' : 'h-48 w-full'
                        }`} />
                    <div className="p-4 flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2" />
                        <div className="h-3 bg-gray-200 rounded mb-2 w-3/4" />
                        <div className="h-5 bg-gray-200 rounded mb-3 w-1/2" />
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-200 rounded-full" />
                            <div className="h-3 bg-gray-200 rounded w-16" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Empty State Component
function EmptyState() {
    return (
        <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-sm">
                <div className="text-gray-400 mb-6">
                    <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Không tìm thấy kết quả phù hợp
                </h3>
                <p className="text-gray-600 mb-6">
                    Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy sản phẩm bạn cần
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                    <p>• Kiểm tra chính tả từ khóa</p>
                    <p>• Thử từ khóa khác hoặc tổng quát hơn</p>
                    <p>• Xóa bớt điều kiện lọc</p>
                </div>
            </div>
        </div>
    );
}