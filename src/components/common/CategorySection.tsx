import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { ChevronRight, ChevronLeft, Grid3X3 } from 'lucide-react';

const CategorySection = () => {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const scrollAmount = 500; // Số px cuộn khi nhấn nút

    const handleScrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    };

    const handleScrollRight = () => {
        scrollRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    const { nestedCategories, nestedLoaded } = useSelector((state: RootState) => state.categories);

    const handleCategoryClick = (categoryId: string) => {
        navigate(`/posts?categoryId=${categoryId}`);
    };

    const allTopLevelCategories = useMemo(() => {
        return nestedLoaded && nestedCategories.length > 0
            ? nestedCategories.filter(cat => cat.level === 1)
            : [];
    }, [nestedCategories, nestedLoaded]);

    // Nhóm mỗi 2 danh mục thành 1 column để tạo 2 hàng
    const groupedCategories = useMemo(() => {
        const groups = [];
        for (let i = 0; i < allTopLevelCategories.length; i += 2) {
            groups.push(allTopLevelCategories.slice(i, i + 2));
        }
        return groups;
    }, [allTopLevelCategories]);

    if (!nestedLoaded || allTopLevelCategories.length === 0) {
        return null;
    }

    return (
        <section className="py-4 bg-white">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Grid3X3 className="w-5 h-5 text-orange-500 mr-2" />
                        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                            DANH MỤC
                        </h2>
                    </div>
                    <button
                        className="flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors group"
                        onClick={() => navigate('/categories')}
                    >
                        Xem tất cả
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Slider Container */}
                <div className="relative">
                    {/* Left Button */}
                    <button
                        onClick={handleScrollLeft}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 group"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-orange-500" />
                    </button>

                    {/* Right Button */}
                    <button
                        onClick={handleScrollRight}
                        className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 group"
                    >
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-orange-500" />
                    </button>

                    {/* Scrollable Category List - 2 Rows */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto scroll-smooth scrollbar-hide space-x-3 py-2 px-1"
                    >
                        {groupedCategories.map((group, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col space-y-3 min-w-[120px] flex-shrink-0"
                            >
                                {group.map(category => (
                                    <div
                                        key={category.id}
                                        className="cursor-pointer group h-[120px]"
                                        onClick={() => handleCategoryClick(category.id.toString())}
                                    >
                                        <div className="bg-white rounded-lg p-3 text-center hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-orange-200 group-hover:bg-orange-50 h-full flex flex-col justify-between">
                                            <div className="flex justify-center items-center mb-1">
                                                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-200">
                                                    {category.imageUrl ? (
                                                        <img
                                                            src={category.imageUrl}
                                                            alt={category.displayName}
                                                            className="w-8 h-8 object-contain"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-orange-400 rounded-md flex items-center justify-center">
                                                            <span className="text-white font-bold text-xs">
                                                                {category.displayName.charAt(0)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <h3 className="text-xs font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2 leading-tight text-center h-[32px] flex items-center justify-center">
                                                {category.displayName}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                                {/* Nếu group chỉ có 1 item, thêm 1 ô trống để giữ layout 2 hàng đều nhau */}
                                {group.length === 1 && (
                                    <div className="h-[120px] opacity-0 pointer-events-none" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-4 text-center">
                    <span className="text-xs text-gray-500">
                        Hiển thị {allTopLevelCategories.length} danh mục
                    </span>
                </div>

                {/* Bottom Border */}
                <div className="mt-6 border-b border-gray-100"></div>
            </div>
        </section>
    );
};

export default CategorySection;
