import { useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';

export const CategoriesInitializer: React.FC = () => {
    const {
        nestedCategories,
        loading,
        error,
        loadCategories,
        shouldFetchCategories,
        nestedLoaded
    } = useCategories();

    useEffect(() => {
        console.log('🏷️ CategoriesInitializer mounted');
        console.log('Current state:', {
            nestedLoaded,
            categoriesCount: nestedCategories.length,
            loading,
            error
        });

        if (shouldFetchCategories() && !loading) {
            console.log('🚀 Starting category initialization...');
            loadCategories();
        } else {
            console.log('⏭️ Skipping category fetch:', {
                shouldFetch: shouldFetchCategories(),
                loading
            });
        }
    }, []);

    useEffect(() => {
        if (nestedCategories.length > 0) {
            console.log(`✅ Categories initialized: ${nestedCategories.length} root categories`);
        }
        if (error) {
            console.error('❌ Categories initialization failed:', error);
        }
    }, [nestedCategories.length, error]);

    return null;
};

export default CategoriesInitializer;