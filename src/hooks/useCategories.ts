import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
    fetchCategories,
    clearError,
    clearCurrentCategory,
    setCategoriesByParent
} from '@/store/slices/categoriesSlice';
import type { Category } from '@/types/category.type';

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

export const useCategories = () => {
    const dispatch = useAppDispatch();
    const {
        nestedCategories,
        categoriesMap,
        categories,
        currentCategory,
        categoriesByParent,
        loading,
        error,
        lastFetched,
        nestedLoaded
    } = useAppSelector((state) => state.categories);

    // Check if categories need to be fetched (cache expired or no data)
    const shouldFetchCategories = () => {
        console.log('🔍 Checking if should fetch categories:', {
            nestedLoaded,
            categoriesLength: nestedCategories.length,
            lastFetched,
            cacheExpired: lastFetched ? Date.now() - lastFetched > CACHE_DURATION : true
        });

        if (!nestedLoaded) return true;
        if (nestedCategories.length === 0) return true;
        if (!lastFetched) return true;
        return Date.now() - lastFetched > CACHE_DURATION;
    };

    // Fetch categories
    const loadCategories = () => {
        console.log('🚀 Loading categories...');
        dispatch(fetchCategories());
    };

    // Helper function to get categories by level from nested structure
    const getCategoriesByLevel = (level: number): Category[] => {
        const result: Category[] = [];

        const collectByLevel = (cats: Category[], currentLevel: number) => {
            cats.forEach(cat => {
                if (cat.level === level) {
                    result.push(cat);
                }
                if (cat.children && cat.children.length > 0) {
                    collectByLevel(cat.children, currentLevel + 1);
                }
            });
        };

        collectByLevel(nestedCategories, 1);
        return result;
    };

    // Helper function to get root categories (parentId === 0 or null)
    const getRootCategories = (): Category[] => {
        return nestedCategories.filter(cat => cat.parentId === 0 || !cat.parentId);
    };

    // Helper function to find category by ID using categoriesMap
    const getCategoryById = (categoryId: number): Category | undefined => {
        return categoriesMap[categoryId];
    };

    // Helper function to get children of a category
    const getChildrenOfCategory = (parentId: number): Category[] => {
        return categoriesMap[parentId]?.children || [];
    };

    // Helper function to get category path (breadcrumb) using categoriesMap
    const getCategoryPath = (categoryId: number): Category[] => {
        const path: Category[] = [];
        let currentCategory = categoriesMap[categoryId];

        while (currentCategory) {
            path.unshift(currentCategory);
            if (currentCategory.parentId && currentCategory.parentId !== 0) {
                currentCategory = categoriesMap[currentCategory.parentId as number];
            } else {
                break;
            }
        }

        return path;
    };

    // Get siblings of a category
    const getSiblingsOfCategory = (categoryId: number): Category[] => {
        const category = categoriesMap[categoryId];
        if (!category) return [];

        if (category.parentId && category.parentId !== 0) {
            return getChildrenOfCategory(category.parentId as number).filter(cat => cat.id !== categoryId);
        } else {
            // Root level siblings
            return getRootCategories().filter(cat => cat.id !== categoryId);
        }
    };

    // Other helper functions...
    const hasChildren = (categoryId: number): boolean => {
        const category = categoriesMap[categoryId];
        return !!(category?.children && category.children.length > 0);
    };

    const getCategoryLevel = (categoryId: number): number => {
        return categoriesMap[categoryId]?.level || 0;
    };

    const searchCategories = (searchTerm: string): Category[] => {
        const searchLower = searchTerm.toLowerCase();
        return Object.values(categoriesMap).filter(category =>
            category.name.toLowerCase().includes(searchLower) ||
            category.displayName.toLowerCase().includes(searchLower)
        );
    };

    const getLeafCategories = (): Category[] => {
        return Object.values(categoriesMap).filter(category =>
            !category.children || category.children.length === 0
        );
    };

    // Clear error
    const clearCategoriesError = () => {
        dispatch(clearError());
    };

    // Clear current category
    const clearCurrentCategoryData = () => {
        dispatch(clearCurrentCategory());
    };

    // Force refresh categories
    const refreshCategories = () => {
        dispatch(fetchCategories());
    };

    // Set categories by parent (for manual updates)
    const setCategoriesByParentId = (parentId: number, categories: Category[]) => {
        dispatch(setCategoriesByParent({ parentId, categories }));
    };

    return {
        // State
        nestedCategories,
        categoriesMap,
        categories,
        currentCategory,
        categoriesByParent,
        loading,
        error,
        lastFetched,
        nestedLoaded,

        // Status flags
        isInitialized: nestedLoaded && nestedCategories.length > 0,
        hasData: nestedCategories.length > 0,

        // Actions
        loadCategories,
        clearCategoriesError,
        clearCurrentCategoryData,
        refreshCategories,
        setCategoriesByParentId,

        // Helper functions
        getCategoriesByLevel,
        getRootCategories,
        getCategoryById,
        getChildrenOfCategory,
        getCategoryPath,
        getSiblingsOfCategory,
        hasChildren,
        getCategoryLevel,
        searchCategories,
        getLeafCategories,
        shouldFetchCategories,

        // Selectors
        selectors: {
            selectRootCategories: () => getRootCategories(),
            selectCategoryById: (id: number) => getCategoryById(id),
            selectChildrenOfCategory: (parentId: number) => getChildrenOfCategory(parentId),
        }
    };
};