import { useSelector, useDispatch } from 'react-redux';
import { useMemo } from 'react';
import type { RootState, AppDispatch } from '@/store';
import type { Province, District, Ward } from '@/types/location.type';
import { fetchLocationTree, clearLocationError } from '@/store/slices/locationSlice';

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

export const useLocation = () => {
    const dispatch = useDispatch<AppDispatch>();
    const locationState = useSelector((state: RootState) => state.location);

    // Check if location data needs to be fetched (cache expired or no data)
    const shouldFetchLocation = () => {
        console.log('🔍 Checking if should fetch location data:', {
            loaded: locationState.loaded,
            provincesLength: locationState.provinces.length,
            lastFetched: locationState.lastFetched,
            cacheExpired: locationState.lastFetched ? Date.now() - locationState.lastFetched > CACHE_DURATION : true
        });

        if (!locationState.loaded) return true;
        if (locationState.provinces.length === 0) return true;
        if (!locationState.lastFetched) return true;
        return Date.now() - locationState.lastFetched > CACHE_DURATION;
    };

    // Selectors với memoization
    const getProvinceByCode = useMemo(() => {
        return (code: number): Province | undefined => {
            return locationState.provinces.find(p => p.code === code);
        };
    }, [locationState.provinces]);

    const getDistrictByCode = useMemo(() => {
        return (provinceCode: number, districtCode: number): District | undefined => {
            const province = getProvinceByCode(provinceCode);
            return province?.districts.find(d => d.code === districtCode);
        };
    }, [getProvinceByCode]);

    const getWardByCode = useMemo(() => {
        return (provinceCode: number, districtCode: number, wardCode: number): Ward | undefined => {
            const district = getDistrictByCode(provinceCode, districtCode);
            return district?.wards.find(w => w.code === wardCode);
        };
    }, [getDistrictByCode]);

    const getDistrictsByProvince = useMemo(() => {
        return (provinceCode: number): District[] => {
            const province = getProvinceByCode(provinceCode);
            return province?.districts || [];
        };
    }, [getProvinceByCode]);

    const getWardsByDistrict = useMemo(() => {
        return (provinceCode: number, districtCode: number): Ward[] => {
            const district = getDistrictByCode(provinceCode, districtCode);
            return district?.wards || [];
        };
    }, [getDistrictByCode]);

    // Tìm kiếm theo tên (case-insensitive)
    const searchProvincesByName = useMemo(() => {
        return (searchTerm: string): Province[] => {
            if (!searchTerm.trim()) return locationState.provinces;
            const term = searchTerm.toLowerCase();
            return locationState.provinces.filter(p =>
                p.name.toLowerCase().includes(term)
            );
        };
    }, [locationState.provinces]);

    const searchDistrictsByName = useMemo(() => {
        return (provinceCode: number, searchTerm: string): District[] => {
            const districts = getDistrictsByProvince(provinceCode);
            if (!searchTerm.trim()) return districts;
            const term = searchTerm.toLowerCase();
            return districts.filter(d =>
                d.name.toLowerCase().includes(term)
            );
        };
    }, [getDistrictsByProvince]);

    const searchWardsByName = useMemo(() => {
        return (provinceCode: number, districtCode: number, searchTerm: string): Ward[] => {
            const wards = getWardsByDistrict(provinceCode, districtCode);
            if (!searchTerm.trim()) return wards;
            const term = searchTerm.toLowerCase();
            return wards.filter(w =>
                w.name.toLowerCase().includes(term)
            );
        };
    }, [getWardsByDistrict]);

    // Actions
    const loadLocationTree = () => {
        console.log('🚀 Loading location tree...');
        dispatch(fetchLocationTree());
    };

    const clearError = () => dispatch(clearLocationError());

    // Force refresh location data
    const refreshLocation = () => {
        dispatch(fetchLocationTree());
    };

    return {
        // State
        ...locationState,

        // Status flags
        isInitialized: locationState.loaded && locationState.provinces.length > 0,
        hasData: locationState.provinces.length > 0,

        // Selectors
        getProvinceByCode,
        getDistrictByCode,
        getWardByCode,
        getDistrictsByProvince,
        getWardsByDistrict,

        // Search functions
        searchProvincesByName,
        searchDistrictsByName,
        searchWardsByName,

        // Actions
        loadLocationTree,
        clearError,
        refreshLocation,
        shouldFetchLocation,
    };
};