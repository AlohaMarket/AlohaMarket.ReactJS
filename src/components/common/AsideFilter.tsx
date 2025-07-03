import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import * as yup from 'yup';
import { useState, useEffect } from 'react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { type QueryConfig } from '@/hooks/useQueryConfig';
import { type Category } from '@/types/category.type';
import { cn } from '@/lib/utils';
import type { NoUndefinedField } from '@/types';
import { priceSchema, type Schema } from '@/utils/rules';

interface AsideFilterProps {
    queryConfig: QueryConfig;
    categories: Category[];
}

type PriceFormData = NoUndefinedField<Pick<Schema, 'minPrice' | 'maxPrice'>>;

export default function AsideFilter({ queryConfig, categories }: AsideFilterProps) {
    const navigate = useNavigate();
    const { categoryId, minPrice, maxPrice } = queryConfig;
    const [currentParentCategory, setCurrentParentCategory] = useState<Category | null>(null);
    const [showMoreCategories, setShowMoreCategories] = useState<Set<string>>(new Set());

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<PriceFormData>({
        defaultValues: {
            minPrice: minPrice || '',
            maxPrice: maxPrice || ''
        },
        resolver: yupResolver<PriceFormData>(priceSchema as yup.ObjectSchema<PriceFormData>)
    });

    // Sync form with URL params when queryConfig changes
    useEffect(() => {
        setValue('minPrice', minPrice || '');
        setValue('maxPrice', maxPrice || '');
    }, [minPrice, maxPrice, setValue]);

    // Auto-expand parent category if a child is selected
    useEffect(() => {
        if (categoryId) {
            const selectedCategory = findCategoryById(categories, categoryId);
            if (selectedCategory) {
                // Find parent category if current selection is a child
                const parentCategory = findParentCategory(categories, categoryId);
                if (parentCategory) {
                    setCurrentParentCategory(parentCategory);
                }
            }
        }
    }, [categoryId, categories]);

    const handlePriceSubmit = (data: PriceFormData) => {
        // Create clean params object - remove old price fields
        const cleanConfig = { ...queryConfig };
        delete cleanConfig.maxPrice;
        delete cleanConfig.minPrice;

        navigate({
            pathname: '/posts',
            search: createSearchParams({
                ...cleanConfig,
                minPrice: data.minPrice,
                maxPrice: data.maxPrice,
                page: '1'
            }).toString()
        });
    };

    const handleCategorySelect = (catId: string) => {
        navigate({
            pathname: '/posts',
            search: createSearchParams({
                ...queryConfig,
                categoryId: catId,
                page: '1'
            }).toString()
        });
    };

    const handleClearAll = () => {
        reset({ minPrice: '', maxPrice: '' });
        // Reset category view when clearing all
        setCurrentParentCategory(null);

        // Preserve other query params, only remove AsideFilter specific params
        const cleanConfig = { ...queryConfig };
        delete cleanConfig.categoryId;
        delete cleanConfig.minPrice;
        delete cleanConfig.maxPrice;

        navigate({
            pathname: '/posts',
            search: createSearchParams({
                ...cleanConfig,
                page: '1'
            }).toString()
        });
    };

    const handleRemoveFilter = (filterType: string) => {
        if (filterType === 'category') {
            // Reset category view when removing category filter
            setCurrentParentCategory(null);
            navigate({
                pathname: '/posts',
                search: createSearchParams({
                    ...queryConfig,
                    categoryId: '',
                    page: '1'
                }).toString()
            });
        }
        if (filterType === 'price') {
            reset({ minPrice: '', maxPrice: '' });
            const cleanConfig = { ...queryConfig };
            delete cleanConfig.minPrice;
            delete cleanConfig.maxPrice;

            navigate({
                pathname: '/posts',
                search: createSearchParams({
                    ...cleanConfig,
                    page: '1'
                }).toString()
            });
        }
    };

    const toggleCategory = (categoryId: string) => {
        const category = findCategoryById(categories, categoryId);
        if (category && category.children && category.children.length > 0) {
            setCurrentParentCategory(category);
        }
    };

    const handleBackToAllCategories = () => {
        setCurrentParentCategory(null);
    };

    // Helper function to find category by ID (including nested)
    const findCategoryById = (categories: Category[], id: string): Category | null => {
        for (const category of categories) {
            if (category.id.toString() === id) {
                return category;
            }
            if (category.children && category.children.length > 0) {
                const found = findCategoryById(category.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    // Helper function to find parent category
    const findParentCategory = (categories: Category[], childId: string): Category | null => {
        for (const category of categories) {
            if (category.children && category.children.length > 0) {
                // Check if childId is in this category's children
                const hasChild = category.children.some(child => child.id.toString() === childId);
                if (hasChild) {
                    return category;
                }
                // Recursively search in nested children
                const found = findParentCategory(category.children, childId);
                if (found) return found;
            }
        }
        return null;
    };

    // Recursive component for rendering categories
    const CategoryItem = ({ category }: { category: Category }) => {
        const hasChildren = category.children && category.children.length > 0;
        const isSelected = categoryId === category.id.toString();

        // Check if any child is selected (for parent highlighting)
        const hasSelectedChild = hasChildren && category.children!.some(child =>
            categoryId === child.id.toString()
        );

        const handleCategoryClick = () => {
            if (hasChildren) {
                // If has children, navigate to this category's view
                toggleCategory(category.id.toString());
            } else {
                // If no children, filter by this category
                handleCategorySelect(category.id.toString());
            }
        };

        return (
            <div key={category.id}>
                <div className="flex items-center">
                    <button
                        onClick={handleCategoryClick}
                        className={cn(
                            "flex items-center w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                            isSelected || hasSelectedChild
                                ? "bg-orange-50 text-orange-600 font-medium"
                                : "text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        <span className="flex-1">
                            {category.displayName}
                            {hasSelectedChild && !isSelected && (
                                <span className="text-xs text-orange-500 ml-1">(đã chọn)</span>
                            )}
                        </span>
                        {hasChildren && (
                            <>
                                <span className="text-xs text-gray-400 mr-2">
                                    ({category.children?.length})
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    };

    // Update active filters to handle nested categories
    const activeFilters = [];
    if (categoryId) {
        const category = findCategoryById(categories, categoryId);
        if (category) {
            activeFilters.push({
                type: 'category',
                label: category.displayName || category.name,
                value: categoryId
            });
        }
    }
    if (minPrice || maxPrice) {
        const priceLabel = `${minPrice ? Number(minPrice).toLocaleString() : '0'} - ${maxPrice ? Number(maxPrice).toLocaleString() : '∞'} đ`;
        activeFilters.push({ type: 'price', label: priceLabel, value: 'price' });
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Bộ lọc tìm kiếm</h3>
                    {activeFilters.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAll}
                            className="text-red-500 hover:text-red-600"
                        >
                            Xóa tất cả
                        </Button>
                    )}
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Active Filters */}
                {activeFilters.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Đang lọc:</h4>
                        <div className="flex flex-wrap gap-2">
                            {activeFilters.map((filter, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs"
                                >
                                    {filter.label}
                                    <button
                                        onClick={() => handleRemoveFilter(filter.type)}
                                        className="ml-1 hover:text-orange-900"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Categories */}
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Danh mục</h4>
                    <div className="space-y-1 overflow-y-auto">
                        {!currentParentCategory ? (
                            <>
                                {/* All categories button */}
                                <button
                                    onClick={() => handleCategorySelect('')}
                                    className={cn(
                                        "block w-full text-left px-3 py-2 rounded-md text-sm transition-colors font-medium",
                                        !categoryId
                                            ? "bg-orange-50 text-orange-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    Tất cả danh mục
                                </button>

                                {/* Top-level categories with show more/less */}
                                {(showMoreCategories.has('root')
                                    ? categories
                                    : categories.slice(0, 10)
                                ).map((category) => (
                                    <CategoryItem key={category.id} category={category} />
                                ))}

                                {categories.length > 10 && (
                                    <button
                                        onClick={() => {
                                            const newShowMore = new Set(showMoreCategories);
                                            if (newShowMore.has('root')) {
                                                newShowMore.delete('root');
                                            } else {
                                                newShowMore.add('root');
                                            }
                                            setShowMoreCategories(newShowMore);
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-md text-xs transition-colors text-blue-600 hover:bg-blue-50"
                                    >
                                        {showMoreCategories.has('root')
                                            ? `Ẩn bớt`
                                            : `Xem thêm (${categories.length - 10} mục)`
                                        }
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Back button */}
                                <button
                                    onClick={handleBackToAllCategories}
                                    className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm transition-colors text-gray-600 hover:bg-gray-50 mb-2"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Tất cả danh mục
                                </button>

                                {/* Select parent category option */}
                                <button
                                    onClick={() => handleCategorySelect(currentParentCategory.id.toString())}
                                    className={cn(
                                        "block w-full text-left px-3 py-2 rounded-md text-sm transition-colors font-medium",
                                        categoryId === currentParentCategory.id.toString()
                                            ? "bg-orange-50 text-orange-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    Tất cả {currentParentCategory.displayName}
                                </button>

                                {/* Children categories */}
                                {currentParentCategory.children && currentParentCategory.children.length > 0 && (
                                    <>
                                        {(showMoreCategories.has(currentParentCategory.id.toString())
                                            ? currentParentCategory.children
                                            : currentParentCategory.children.slice(0, 10)
                                        ).map((child) => (
                                            <CategoryItem key={child.id} category={child} />
                                        ))}

                                        {/* Show more/less button */}
                                        {currentParentCategory.children.length > 10 && (
                                            <button
                                                onClick={() => {
                                                    const newShowMore = new Set(showMoreCategories);
                                                    if (newShowMore.has(currentParentCategory.id.toString())) {
                                                        newShowMore.delete(currentParentCategory.id.toString());
                                                    } else {
                                                        newShowMore.add(currentParentCategory.id.toString());
                                                    }
                                                    setShowMoreCategories(newShowMore);
                                                }}
                                                className="w-full text-left px-3 py-2 rounded-md text-xs transition-colors text-blue-600 hover:bg-blue-50"
                                            >
                                                {showMoreCategories.has(currentParentCategory.id.toString())
                                                    ? `Ẩn bớt`
                                                    : `Xem thêm (${currentParentCategory.children.length - 10} mục)`
                                                }
                                            </button>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Khoảng giá</h4>
                    <form onSubmit={handleSubmit(handlePriceSubmit)} className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Controller
                                control={control}
                                name="minPrice"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Từ"
                                        className="flex-1"
                                    />
                                )}
                            />
                            <span className="text-gray-400">-</span>
                            <Controller
                                control={control}
                                name="maxPrice"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Đến"
                                        className="flex-1"
                                    />
                                )}
                            />
                        </div>
                        {errors.minPrice && (
                            <p className="text-red-500 text-xs">{errors.minPrice.message}</p>
                        )}
                        {errors.maxPrice && (
                            <p className="text-red-500 text-xs">{errors.maxPrice.message}</p>
                        )}
                        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                            Áp dụng
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}