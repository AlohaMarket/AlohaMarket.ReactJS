import { Clock, MapPin } from 'lucide-react';
import type { PostListResponse } from '@/types/post.type';

interface PostCardProps {
    post: PostListResponse;
    layout?: 'grid' | 'list';
    onClick?: () => void;
}

export default function PostCard({
    post,
    layout = 'grid',
    onClick
}: PostCardProps) {
    if (layout === 'list') {
        return (
            <div
                className="bg-white shadow-sm border border-gray-100 cursor-pointer flex overflow-hidden"
                onClick={onClick}
            >
                {/* Image */}
                <div className="relative w-48 h-32 flex-shrink-0">
                    {post.image?.imageUrl ? (
                        <img
                            src={post.image.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://static.vecteezy.com/system/resources/previews/014/814/251/non_2x/a-sale-tag-in-flat-modern-design-vector.jpg';
                            }}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-blue-600 font-medium">Chưa có ảnh</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                            {post.title}
                        </h3>
                        <p className="text-lg font-bold text-red-600 mb-2">
                            {post.price.toLocaleString()} đ
                        </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{post.provinceText}</span>
                        </div>
                        {/* <span>{formatRelativeTime(post.createdAt)}</span> */}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="group cursor-pointer"
            onClick={onClick}
        >
            <div className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
                {/* Image Container */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0 relative">
                    {post.image?.imageUrl ? (
                        <img
                            src={post.image.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://static.vecteezy.com/system/resources/previews/014/814/251/non_2x/a-sale-tag-in-flat-modern-design-vector.jpg';
                            }}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-blue-600 font-medium">Chưa có ảnh</span>
                            </div>
                        </div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="text-blue-600 font-bold text-sm">
                                {post.price > 0 ? (
                                    new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                        notation: 'compact'
                                    }).format(post.price)
                                ) : (
                                    'Liên hệ'
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 min-h-[3.5rem] text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {post.title || 'Không có tiêu đề'}
                    </h3>

                    <div className="flex items-center text-gray-500 mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm line-clamp-1">
                            {post.provinceText || 'Chưa xác định vị trí'}
                        </span>
                    </div>

                    {/* Price and Date */}
                    <div className="flex items-center justify-between mb-4 mt-auto">
                        <span className="text-blue-600 font-bold text-xl">
                            {post.price > 0 ? (
                                new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(post.price)
                            ) : (
                                'Liên hệ'
                            )}
                        </span>
                        <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            {/* <span>
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </span> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}