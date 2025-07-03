import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Clock,
    User as UserIcon,
    Phone,
    MessageCircle,
    Heart,
    Share2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

import { postsApi } from '@/apis/post';
import { authApi } from '@/apis/auth';
import PostList from '@/components/common/PostList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatRelativeTime } from '@/utils';
import type { PostFilters } from '@/types/post.type';
import toast from 'react-hot-toast';

export default function PostDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [currentIndexImages, setCurrentIndexImages] = useState([0, 5]);
    const [activeImage, setActiveImage] = useState('');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    // Fetch post detail
    const { data: postDetailData, isLoading, error } = useQuery({
        queryKey: ['post', id],
        queryFn: () => postsApi.getPost(id as string),
        enabled: !!id
    });

    const post = postDetailData;

    const { data: seller } = useQuery({
        queryKey: ['seller', post?.userId],
        queryFn: () => authApi.getSellerInfo(post!.userId as string),
        enabled: !!post?.userId
    });

    // Get current visible images for image slider
    const currentImages = useMemo(
        () => (post ? post.images.slice(...currentIndexImages) : []),
        [post, currentIndexImages]
    );

    // Filters for similar posts (same category and location)
    const similarPostsFilters: PostFilters = useMemo(() => ({
        categoryId: post?.categoryId ? undefined : undefined,
        locationId: post?.provinceCode ? undefined : undefined,
        pageSize: 8
    }), [post]);

    useEffect(() => {
        if (post && post.images.length > 0) {
            setActiveImage(post.images[0].imageUrl);
        }
    }, [post]);

    const nextImage = () => {
        if (post && currentIndexImages[1] < post.images.length) {
            setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1]);
        }
    };

    const prevImage = () => {
        if (currentIndexImages[0] > 0) {
            setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1]);
        }
    };

    const chooseActiveImage = (imageUrl: string) => {
        setActiveImage(imageUrl);
    };

    const handleImageZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const image = imageRef.current as HTMLImageElement;
        const { naturalHeight, naturalWidth } = image;

        const offsetX = event.pageX - (rect.x + window.scrollX);
        const offsetY = event.pageY - (rect.y + window.scrollY);

        const top = offsetY * (1 - naturalHeight / rect.height);
        const left = offsetX * (1 - naturalWidth / rect.width);

        image.style.width = naturalWidth + 'px';
        image.style.height = naturalHeight + 'px';
        image.style.maxWidth = 'unset';
        image.style.top = top + 'px';
        image.style.left = left + 'px';
    };

    const handleRemoveZoom = () => {
        imageRef.current?.removeAttribute('style');
    };

    const handleContactSeller = () => {
        // Navigate to chat or show contact modal
        // toast.info('Tính năng liên hệ người bán đang được phát triển');
    };

    const handleToggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post?.title || 'Bài đăng trên Aloha Market',
                text: post?.description || 'Xem bài đăng này trên Aloha Market',
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Đã sao chép liên kết');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài đăng</h2>
                    <p className="text-gray-600 mb-6">Bài đăng có thể đã bị xóa hoặc không tồn tại.</p>
                    <Button onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-6">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-6 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
                        {/* Image Gallery */}
                        <div className="lg:col-span-5">
                            <div
                                className="relative w-full cursor-zoom-in overflow-hidden rounded-xl bg-gray-100 aspect-square shadow-sm"
                                onMouseMove={handleImageZoom}
                                onMouseLeave={handleRemoveZoom}
                            >
                                <img
                                    src={activeImage}
                                    alt={post.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    ref={imageRef}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://static.vecteezy.com/system/resources/previews/014/814/251/non_2x/a-sale-tag-in-flat-modern-design-vector.jpg';
                                    }}
                                />
                            </div>

                            {/* Image Thumbnails */}
                            {post.images.length > 1 && (
                                <div className="relative mt-4 grid grid-cols-5 gap-2">
                                    {currentIndexImages[0] > 0 && (
                                        <button
                                            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                                            onClick={prevImage}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                    )}

                                    {currentImages.map((img, index) => {
                                        const isActive = img.imageUrl === activeImage;
                                        return (
                                            <div
                                                key={index}
                                                className="relative aspect-square cursor-pointer rounded-lg overflow-hidden"
                                                onMouseEnter={() => chooseActiveImage(img.imageUrl)}
                                            >
                                                <img
                                                    src={img.imageUrl}
                                                    alt={`${post.title} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'https://static.vecteezy.com/system/resources/previews/014/814/251/non_2x/a-sale-tag-in-flat-modern-design-vector.jpg';
                                                    }}
                                                />
                                                {isActive && (
                                                    <div className="absolute inset-0 border-2 border-blue-500 rounded-lg" />
                                                )}
                                            </div>
                                        );
                                    })}

                                    {post.images.length > currentIndexImages[1] && (
                                        <button
                                            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                                            onClick={nextImage}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Post Details */}
                        <div className="lg:col-span-7">
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                                    {post.title}
                                </h1>
                                <div className="flex items-center gap-2 ml-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleToggleWishlist}
                                        className={isWishlisted ? 'text-red-600 border-red-200' : ''}
                                    >
                                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleShare}>
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                <div className="text-3xl font-bold text-blue-600">
                                    {formatCurrency(post.price)} đ
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Giá có thể thương lượng</p>
                            </div>

                            {/* Location and Time */}
                            <div className="flex flex-col gap-4 mb-6 text-gray-600">
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span>
                                        {[post.wardText, post.districtText, post.provinceText]
                                            .filter(Boolean)
                                            .join(', ') || 'Chưa xác định vị trí'}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>Đăng {formatRelativeTime(new Date(post.createdAt))}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả chi tiết</h3>
                                <div
                                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: post.description
                                    }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={handleContactSeller}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Liên hệ người bán
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleContactSeller}
                                    className="flex-1"
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Gọi điện
                                </Button>
                            </div>

                            {/* Seller Info */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-3">Thông tin người bán</h4>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        {seller?.avatarUrl ? (
                                            <img
                                                src={seller.avatarUrl}
                                                alt={seller.userName}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <UserIcon className="w-6 h-6 text-blue-600" />
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-900">
                                            {seller?.userName || `Người bán #${post.userId}`}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {seller?.phoneNumber ? `SĐT: ${seller.phoneNumber}` : 'Chưa có số điện thoại'}
                                        </p>
                                        {seller?.createdAt && (
                                            <p className="text-sm text-gray-600">
                                                Thành viên từ {new Date(seller.createdAt).getFullYear()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Posts Section */}
                <div className="mt-12">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tin đăng tương tự</h2>
                        <p className="text-gray-600">Các tin đăng khác trong cùng khu vực và danh mục</p>
                    </div>

                    <PostList
                        filters={similarPostsFilters}
                        pageSize={8}
                        onPostClick={(postId) => navigate(`/post/${postId}`)}
                    />
                </div>
            </div>
        </div>
    );
}
