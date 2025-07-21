import { useEffect } from 'react';
import { useLocation } from '@/hooks/useLocation';

const LocationInitializer = () => {
    const {
        provinces,
        loading,
        error,
        loaded,
        loadLocationTree,
        shouldFetchLocation
    } = useLocation();

    useEffect(() => {
        console.log('🏢 LocationInitializer mounted');
        console.log('Current state:', {
            loaded,
            provincesCount: provinces.length,
            loading,
            error
        });

        if (shouldFetchLocation() && !loading) {
            console.log('🚀 Starting location initialization...');
            loadLocationTree();
        } else {
            console.log('⏭️ Skipping location fetch:', {
                shouldFetch: shouldFetchLocation(),
                loading
            });
        }
    }, []); // Empty dependency array to prevent re-execution

    useEffect(() => {
        if (provinces.length > 0) {
            console.log(`✅ Location tree initialized: ${provinces.length} provinces`);
        }
        if (error) {
            console.error('❌ Location initialization failed:', error);
        }
    }, [provinces.length, error]);

    return null;
};

export default LocationInitializer;