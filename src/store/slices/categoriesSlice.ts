import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { categoryAPI } from '@/apis/category';
import type { Category } from '@/types/category.type';

// Helper function để flatten categories thành map cho tìm kiếm nhanh
const flattenCategories = (categories: Category[]): { [id: number]: Category } => {
    const flattened: { [id: number]: Category } = {};

    const flatten = (cats: Category[]) => {
        cats.forEach(cat => {
            flattened[cat.id] = cat;
            if (cat.children && cat.children.length > 0) {
                flatten(cat.children);
            }
        });
    };

    flatten(categories);
    return flattened;
};

const extractFlatCategories = (nestedCategories: Category[]): Category[] => {
    const flatArray: Category[] = [];

    const extract = (cats: Category[]) => {
        cats.forEach(cat => {
            flatArray.push(cat);
            if (cat.children && cat.children.length > 0) {
                extract(cat.children);
            }
        });
    };

    extract(nestedCategories);
    return flatArray;
};

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            console.log('🔄 Fetching categories from API...');
            const categories = await categoryAPI.getAllCategories();
            console.log('✅ Categories fetched:', categories.length);
            console.log('📊 First category structure:', categories[0]);
            return categories;
        } catch (error: unknown) {
            console.error('❌ Error fetching categories:', error);
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to fetch categories';
            return rejectWithValue(errorMessage);
        }
    }
);

export interface CategoriesState {
    nestedCategories: Category[];
    categoriesMap: { [id: number]: Category };
    categories: Category[];
    currentCategory: Category | null;
    categoriesByParent: { [parentId: number]: Category[] };
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
    nestedLoaded: boolean;
}

const initialState: CategoriesState = {
    nestedCategories: [],
    categoriesMap: {},
    categories: [],
    currentCategory: null,
    categoriesByParent: {},
    loading: false,
    error: null,
    lastFetched: null,
    nestedLoaded: false,
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentCategory: (state) => {
            state.currentCategory = null;
        },
        setCategoriesByParent: (state, action: PayloadAction<{ parentId: number; categories: Category[] }>) => {
            state.categoriesByParent[action.payload.parentId] = action.payload.categories;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                console.log('⏳ Categories loading...');
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                console.log('✅ Categories loaded successfully:', action.payload.length);

                state.nestedCategories = action.payload;

                state.categories = extractFlatCategories(action.payload);

                state.categoriesMap = flattenCategories(action.payload);

                state.loading = false;
                state.nestedLoaded = true;
                state.lastFetched = Date.now();
                state.error = null;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                console.error('❌ Categories loading failed:', action.payload);
                state.loading = false;
                state.error = action.payload as string;
                state.nestedLoaded = false;
            });
    },
});

export const { clearError, clearCurrentCategory, setCategoriesByParent } = categoriesSlice.actions;
export default categoriesSlice.reducer;

// Selectors
export const selectRootCategories = (state: { categories: CategoriesState }) => {
    return state.categories.nestedCategories;
};

export const selectCategoryById = (state: { categories: CategoriesState }, id: number) =>
    state.categories.categoriesMap[id];

export const selectChildrenOfCategory = (state: { categories: CategoriesState }, parentId: number) =>
    state.categories.categoriesMap[parentId]?.children || [];
