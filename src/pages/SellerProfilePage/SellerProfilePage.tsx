import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { authApi } from '@/apis/auth';
import { postsApi } from '@/apis/post';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';

import PostCard from '@/components/common/PostCard';
import { PostStatus, type PostListResponse, type UserPostFilters } from '@/types/post.type';
import type { PaginatedResponse } from '@/types';
import type { Seller } from '@/types/user.type';

export default function SellerProfilePage() {
    const { id } = useParams(); // Get seller ID from URL
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'validated' | 'archived'>('validated');
    const pageSize = 12;

    // Scroll to top of posts section
    const scrollToTop = () => {
        const element = document.querySelector('.bg-white.rounded-lg.shadow-sm');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Handle page change with scroll
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        scrollToTop();
    };

    // Reset page when tab changes
    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    // Convert tab to PostStatus
    const getStatusFromTab = (tab: 'validated' | 'archived'): PostStatus => {
        return tab === 'validated' ? PostStatus.Validated : PostStatus.Archived;
    };

    // Fetch seller profile
    const {
        data: seller,
        isLoading: isLoadingProfile,
        error: profileError
    } = useQuery<Seller>({
        queryKey: ['seller-profile', id],
        queryFn: () => authApi.getSellerInfo(id as string),
        enabled: !!id
    });

    // Fetch seller's posts
    const {
        data: postsData,
        isLoading: isLoadingPosts,
        error: postsError
    } = useQuery<PaginatedResponse<PostListResponse>>({
        queryKey: ['seller-posts', id, page, activeTab],
        queryFn: () => postsApi.getPostsBySeller(
            id as string,
            {
                page,
                pageSize,
                status: getStatusFromTab(activeTab)
            } as UserPostFilters),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!id
    });

    if (isLoadingProfile || isLoadingPosts) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (profileError || !seller) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-xl font-medium text-gray-900">
                    {t('seller.profile_not_found')}
                </h2>
            </div>
        );
    }

    const posts = postsData?.items || [];
    const pagination = postsData?.meta;

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center text-sm mb-4">
                <a href="/" className="text-gray-600 hover:text-yellow-600">
                    Aloha Market
                </a>
                <span className="mx-2 text-gray-400">›</span>
                <span className="text-gray-800">{t('navigation.sellerProfile')}</span>
            </div>

            {/* Main seller info header */}
            <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center">
                    {/* Seller Avatar */}
                    <div className="relative mr-6">
                        {seller.avatarUrl ? (
                            <img
                                src={seller.avatarUrl}
                                alt={t("user_detail.avatar_alt")}
                                className="w-24 h-24 rounded-full border-2 border-gray-200"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-2xl text-gray-500">{seller.userName?.charAt(0).toUpperCase() || '?'}</span>
                            </div>
                        )}
                    </div>

                    {/* Seller Info */}
                    <div className="mt-4 md:mt-0">
                        <h1 className="text-2xl font-bold">{seller.userName}</h1>
                        <div className="flex items-center mt-1">
                            <div className="flex items-center text-yellow-500">
                                {'★'.repeat(4)}{'☆'.repeat(1)}
                            </div>
                            <span className="ml-2 text-gray-500">4.5/5</span>
                        </div>
                        <div className="flex items-center mt-2 text-gray-500 text-sm">
                            <span className="mr-4">
                                <span className="font-medium">{t('profile.joined')}:</span> {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : '-'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Side-by-side Layout: 1/3 Profile Info and 2/3 Product Listings */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Left Column - Seller Info (1/3 width) */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        {/* Seller Info Details */}
                        <div className="grid gap-4 mb-6">
                            <div className="flex border-b border-gray-100 pb-3">
                                <span className="font-medium w-32 text-gray-500">{t('profile.name')}:</span>
                                <span className="text-gray-900">{seller.userName || '-'}</span>
                            </div>
                            <div className="flex border-b border-gray-100 pb-3">
                                <span className="font-medium w-32 text-gray-500">{t('profile.phone')}:</span>
                                <span className="text-gray-900">{seller.phoneNumber || '-'}</span>
                            </div>
                            <div className="flex border-b border-gray-100 pb-3">
                                <span className="font-medium w-32 text-gray-500">{t('profile.joined')}:</span>
                                <span className="text-gray-900">{seller.createdAt || '-'}</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column - Product Listings (2/3 width) */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="border-b border-gray-100">
                            <div className="flex">
                                <button
                                    className={`flex-1 py-3 text-center font-medium ${activeTab === 'validated'
                                        ? 'text-yellow-600 border-b-2 border-yellow-500'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    onClick={() => {
                                        setActiveTab('validated');
                                        setPage(1);
                                    }}
                                >
                                    {t('profile.validatedListings')}
                                </button>
                                <button
                                    className={`flex-1 py-3 text-center font-medium ${activeTab === 'archived'
                                        ? 'text-yellow-600 border-b-2 border-yellow-500'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    onClick={() => {
                                        setActiveTab('archived');
                                        setPage(1);
                                    }}
                                >
                                    {t('profile.archivedListings')}
                                </button>
                            </div>
                        </div>

                        {/* Listings Content */}
                        <div className="p-4">
                            {isLoadingPosts ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[...Array(6)].map((_, index) => (
                                        <div key={index} className="border rounded-lg p-4 animate-pulse">
                                            <div className="bg-gray-200 w-full h-48 rounded-lg mb-4" />
                                            <div className="h-4 bg-gray-200 rounded mb-2" />
                                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                                        </div>
                                    ))}
                                </div>
                            ) : postsError ? (
                                <div className="text-center py-10">
                                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">{t('errors.failed_to_load')}</h3>
                                    <p className="text-gray-500 mb-4">{t('errors.try_again_later')}</p>
                                    <Button onClick={() => window.location.reload()}>
                                        {t('actions.reload')}
                                    </Button>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                                        {t('seller.no_listings')}
                                    </h3>
                                    <p className="text-gray-500">
                                        {t('seller.no_listings_description')}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {posts.map((post) => (
                                            <PostCard
                                                key={post.id}
                                                post={post}
                                                onClick={() => navigate(`/post/${post.id}`)}
                                            />
                                        ))}
                                    </div>

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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
