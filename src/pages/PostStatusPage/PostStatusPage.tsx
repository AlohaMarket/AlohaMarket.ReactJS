import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/apis/post';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, AlertCircle, Clock, Check, Eye, ArrowLeft, Home } from 'lucide-react';
import type { PostCreateResponse } from '@/types/post.type';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { PostValidationStatusBadge } from '@/components/common/PostValidationStatusBadge';
import { PostStatus } from '@/types/post.type';

const PostStatusPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [refreshing, setRefreshing] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [countdown, setCountdown] = useState(15);

    // Fetch post details
    const {
        data: post,
        isLoading,
        error,
        refetch
    } = useQuery<PostCreateResponse>({
        queryKey: ['post', id, 'validation'],
        queryFn: () => postsApi.getPostAfterCreate(id!),
        enabled: !!id,
        refetchOnWindowFocus: false
    });

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    const handleViewPost = () => {
        navigate(`/post/${id}`);
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleBackToPosts = () => {
        navigate('/my-posts');
    };

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        let countdownTimer: NodeJS.Timeout | null = null;

        if (autoRefresh) {
            setCountdown(15);

            countdownTimer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        return 15;
                    }
                    return prev - 1;
                });
            }, 1000);

            timer = setInterval(() => {
                refetch();
            }, 15000);
        }

        return () => {
            if (timer) clearInterval(timer);
            if (countdownTimer) clearInterval(countdownTimer);
        };
    }, [autoRefresh, refetch]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <CardTitle>Không tìm thấy bài đăng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-center text-gray-600">
                            Bài đăng có thể đã bị xóa hoặc không tồn tại
                        </p>
                        <div className="flex flex-col space-y-2">
                            <Button onClick={handleBackToHome}>
                                <Home className="mr-2 h-4 w-4" />
                                Về trang chủ
                            </Button>
                            <Button variant="outline" onClick={handleBackToPosts}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Quay lại danh sách bài đăng của tôi
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    const validationMessages = [];

    if (post?.locationValidationMessage) {
        validationMessages.push(post.locationValidationMessage);
    }

    if (post?.categoryValidationMessage) {
        validationMessages.push(post.categoryValidationMessage);
    }

    if (post?.userPlanValidationMessage) {
        validationMessages.push(post.userPlanValidationMessage);
    }

    // Determine validation status directly from post data
    const status = post.status;
    const errors = validationMessages;
    const isPending = status === PostStatus.PendingValidation;
    const isValid = status === PostStatus.Validated;
    const isInvalid = status === PostStatus.Invalid;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                <Button variant="ghost" onClick={handleBackToPosts} className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại danh sách
                </Button>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Trạng thái kiểm duyệt bài đăng</CardTitle>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="flex items-center gap-1"
                                >
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                    Làm mới
                                </Button>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="checkbox"
                                        id="autoRefresh"
                                        checked={autoRefresh}
                                        onChange={() => setAutoRefresh(prev => !prev)}
                                        className="rounded"
                                    />
                                    <label htmlFor="autoRefresh" className="text-sm">
                                        {autoRefresh ? `Tự động làm mới (${countdown}s)` : 'Tự động làm mới'}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-6">
                            {/* Post Title & Image */}
                            <div className="flex items-start gap-4">
                                <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                    {post.images && post.images.length > 0 ? (
                                        <img
                                            src={post.images[0].imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                            <span className="text-gray-400">No image</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">
                                        Giá: {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(post.price)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        ID: {post.id}
                                    </p>
                                </div>
                            </div>

                            {/* Status Section */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-4">
                                        {isPending && (
                                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                                                <Clock className="w-8 h-8 text-yellow-600" />
                                            </div>
                                        )}
                                        {isValid && (
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                                <Check className="w-8 h-8 text-green-600" />
                                            </div>
                                        )}
                                        {isInvalid && (
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                                                <AlertCircle className="w-8 h-8 text-red-600" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <PostValidationStatusBadge
                                            status={status}
                                            errors={errors}
                                            showDetails={true}
                                            className="justify-center"
                                        />
                                    </div>

                                    <div className="text-sm text-gray-600 mb-6">
                                        {isPending && (
                                            <p>Bài đăng của bạn đang được kiểm duyệt. Quá trình này có thể mất vài phút.</p>
                                        )}
                                        {isValid && (
                                            <p>Chúc mừng! Bài đăng của bạn đã được phê duyệt và hiển thị công khai.</p>
                                        )}
                                        {isInvalid && (
                                            <p>Bài đăng của bạn chưa đáp ứng đủ điều kiện để được đăng công khai.</p>
                                        )}
                                    </div>

                                    {/* Auto refresh info */}
                                    <div className="mb-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium 
                                            ${autoRefresh ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'}`}>
                                            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                            {autoRefresh ? 'Đang tự động làm mới' : 'Chế độ làm mới thủ công'}
                                        </div>
                                    </div>

                                    {/* Detailed Status Info */}
                                    <div className="w-full max-w-md bg-white rounded-md p-4 border border-gray-200 text-left mb-6">
                                        <h4 className="font-medium text-gray-900 mb-2">Chi tiết kiểm duyệt:</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${post.isLocationValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span>Vị trí: {post.isLocationValid ? 'Hợp lệ' : 'Không hợp lệ'}</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${post.isCategoryValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span>Danh mục: {post.isCategoryValid ? 'Hợp lệ' : 'Không hợp lệ'}</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${post.isUserPlanValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span>Gói đăng tin: {post.isUserPlanValid ? 'Hợp lệ' : 'Không hợp lệ'}</span>
                                            </li>
                                            <li className="text-xs text-gray-500 mt-2">
                                                Cập nhật lúc: {new Date().toLocaleString()}
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button onClick={handleViewPost}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Xem bài đăng
                                        </Button>
                                        {isInvalid && (
                                            <Button variant="outline" onClick={() => navigate(`/create-post`)}>
                                                Đăng bài mới
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PostStatusPage;
