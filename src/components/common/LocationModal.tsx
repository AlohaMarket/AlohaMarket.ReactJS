import { useState, useEffect, useMemo } from 'react';
import {
    X,
    ChevronDown,
    MapPin
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useLocation } from '@/hooks/useLocation';
import { LocationType, type Province, type District, type Ward } from '@/types/location.type';

interface SelectedLocation {
    province?: Province | undefined;
    district?: District | undefined;
    ward?: Ward | undefined;
}

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (locationId: number, locationLevel: LocationType, displayText: string) => void;
    initialLocation?: SelectedLocation; // Add this to receive initial state
}

export const LocationModal = ({
    isOpen,
    onClose,
    onSelectLocation,
    initialLocation
}: LocationModalProps) => {
    const {
        provinces,
        getDistrictsByProvince,
        getWardsByDistrict,
        searchProvincesByName
    } = useLocation();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>(initialLocation || {});

    // Popular cities data
    const popularCities = [
        { name: 'Tp Hồ Chí Minh', code: 79 },
        { name: 'Hà Nội', code: 1 },
        { name: 'Đà Nẵng', code: 48 }
    ];

    // Reset search term when modal opens, but keep selected location
    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            // Don't reset selectedLocation to preserve user's previous selection
        }
    }, [isOpen]);

    // Sync with initialLocation when it changes
    useEffect(() => {
        if (initialLocation) {
            setSelectedLocation(initialLocation);
        }
    }, [initialLocation]);

    // Optimize with useMemo to prevent unnecessary re-computations
    const districts = useMemo(() => {
        return selectedLocation.province ? getDistrictsByProvince(selectedLocation.province.code) : [];
    }, [selectedLocation.province, getDistrictsByProvince]);

    // Get wards for selected district
    const wards = useMemo(() => {
        return selectedLocation.province && selectedLocation.district
            ? getWardsByDistrict(selectedLocation.province.code, selectedLocation.district.code)
            : [];
    }, [selectedLocation.province, selectedLocation.district, getWardsByDistrict]);

    // Filter provinces based on search
    const filteredProvinces = useMemo(() => {
        return searchProvincesByName(searchTerm);
    }, [searchTerm, searchProvincesByName]);

    if (!isOpen) return null;

    // Handle popular city selection
    const handlePopularCitySelect = (cityCode: number) => {
        const province = provinces.find(p => p.code === cityCode);
        if (province) {
            onSelectLocation(province.code, LocationType.PROVINCE, province.name);
            setSelectedLocation({ province, district: undefined, ward: undefined });
            onClose();
        }
    };

    // Handle province selection
    const handleProvinceSelect = (province: Province) => {
        setSelectedLocation({ ...selectedLocation, province, district: undefined, ward: undefined });
    };

    // Handle district selection
    const handleDistrictSelect = (district: District) => {
        setSelectedLocation({ ...selectedLocation, district, ward: undefined });
    };

    // Handle ward selection
    const handleWardSelect = (ward: Ward) => {
        setSelectedLocation({ ...selectedLocation, ward });
    };

    // Handle confirm selection
    const handleConfirm = () => {
        if (selectedLocation.ward) {
            const displayText = `${selectedLocation.ward.name}, ${selectedLocation.district?.name}, ${selectedLocation.province?.name}`;
            onSelectLocation(selectedLocation.ward.code, LocationType.WARD, displayText);
        } else if (selectedLocation.district) {
            const displayText = `${selectedLocation.district.name}, ${selectedLocation.province?.name}`;
            onSelectLocation(selectedLocation.district.code, LocationType.DISTRICT, displayText);
        } else if (selectedLocation.province) {
            onSelectLocation(selectedLocation.province.code, LocationType.PROVINCE, selectedLocation.province.name);
        }

        // Don't clear selectedLocation here to preserve state
        onClose();
    };

    // Handle clear selection
    const handleClear = () => {
        setSelectedLocation({});
    };



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MapPin size={20} className="text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Tìm kiếm quanh bạn</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 hover:bg-gray-100"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Search Input */}
                <div className="mb-4">
                    <Input
                        type="text"
                        placeholder="Nhập vị trí và khoảng cách tìm kiếm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                </div>

                {/* Location Selection */}
                <div className="mb-6">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MapPin size={16} />
                        Tìm theo khu vực
                    </h3>

                    {/* Popular Cities */}
                    <div className="mb-4 flex flex-wrap gap-2">
                        {popularCities.map((city) => (
                            <button
                                key={city.code}
                                onClick={() => handlePopularCitySelect(city.code)}
                                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 transition hover:bg-orange-100 hover:text-orange-600"
                            >
                                {city.name}
                            </button>
                        ))}
                    </div>

                    {/* Location Dropdowns */}
                    <div className="space-y-3">
                        {/* Province Selection */}
                        <div className="relative">
                            <select
                                value={selectedLocation.province?.code || ''}
                                onChange={(e) => {
                                    const provinceCode = parseInt(e.target.value);
                                    const province = provinces.find(p => p.code === provinceCode);
                                    if (province) {
                                        handleProvinceSelect(province);
                                    }
                                }}
                                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                            >
                                <option value="" className="text-gray-500">Chọn tỉnh thành</option>
                                {filteredProvinces.map((province) => (
                                    <option key={province.code} value={province.code} className="text-gray-900 bg-white">
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* District Selection */}

                        <div className="relative">
                            <select
                                value={selectedLocation.district?.code || ''}
                                onChange={(e) => {
                                    const districtCode = parseInt(e.target.value);
                                    const district = districts.find(d => d.code === districtCode);
                                    if (district) {
                                        handleDistrictSelect(district);
                                    }
                                }}
                                disabled={!selectedLocation.province}
                                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                            >
                                <option value="" className="text-gray-500">Chọn quận huyện</option>
                                {districts.map((district) => (
                                    <option key={district.code} value={district.code} className="text-gray-900 bg-white">
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>


                        {/* Ward Selection */}
                        <div className="relative">
                            <select
                                value={selectedLocation.ward?.code || ''}
                                onChange={(e) => {
                                    const wardCode = parseInt(e.target.value);
                                    const ward = wards.find(w => w.code === wardCode);
                                    if (ward) {
                                        handleWardSelect(ward);
                                    }
                                }}
                                disabled={!selectedLocation.district}
                                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                            >
                                <option value="" className="text-gray-500">Chọn phường xã</option>
                                {wards.map((ward) => (
                                    <option key={ward.code} value={ward.code} className="text-gray-900 bg-white">
                                        {ward.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3">
                    <Button
                        onClick={handleClear}
                        variant="outline"
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                        Xóa Lọc
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedLocation.province}
                        className="flex-1 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:bg-gray-300"
                    >
                        Áp dụng
                    </Button>
                </div>
            </div>
        </div>
    );
};