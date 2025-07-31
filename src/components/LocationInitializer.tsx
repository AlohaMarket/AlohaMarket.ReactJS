import { useEffect } from 'react';
import { useLocation } from '@/hooks/useLocation';

const LocationInitializer = () => {
    const {
        provinces,
        loading,
        error,
        loadLocationTree,
        shouldFetchLocation
    } = useLocation();

    useEffect(() => {

        if (shouldFetchLocation() && !loading) {
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