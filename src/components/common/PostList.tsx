import { useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfinitePosts } from '@/hooks/useInfinitePosts';
import PostCard from './PostCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { PostFilters } from '@/types/post.type';

interface PostListProps {
    filters?: PostFilters;
    pageSize?: number;
    onPostClick?: (postId: string) => void;
}

export default function PostList({
    filters = {},
    pageSize = 8,
    onPostClick
}: PostListProps) {
    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfinitePosts(filters, pageSize);

    // Intersection Observer for infinite scroll
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: false
    });

    // Auto fetch next page when user scrolls to bottom
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Flatten all pages data into a single array
    const posts = data?.pages.flatMap(page => page.items) || [];

    const handlePostClick = useCallback((postId: string) => {
        if (onPostClick) {
            onPostClick(postId);
        }
    }, [onPostClick]);

    // Skeleton loader component
    const PostSkeleton = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded mb-3 w-1/2"></div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(pageSize)].map((_, index) => (
                    <PostSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                    <div className="text-red-600 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
                    <p className="text-red-600 mb-4">{error.message || 'Vui lòng thử lại sau.'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onClick={() => handlePostClick(post.id)}
                    />
                ))}
            </div>

            {/* Loading indicator for infinite scroll */}
            {isFetchingNextPage && (
                <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-3 bg-blue-50 text-blue-600 px-6 py-3 rounded-full">
                        <LoadingSpinner />
                        <span className="font-medium">Đang tải thêm bài đăng...</span>
                    </div>
                </div>
            )}

            {/* Intersection observer trigger */}
            {hasNextPage && (
                <div ref={ref} className="h-10 flex items-center justify-center">
                    {/* This div will trigger fetchNextPage when visible */}
                </div>
            )}

            {/* End of posts message */}
            {!hasNextPage && posts.length > 0 && (
                <div className="text-center mt-8 py-4">
                    <p className="text-gray-500">Đã hiển thị tất cả bài đăng</p>
                </div>
            )}
        </div>
    );
}