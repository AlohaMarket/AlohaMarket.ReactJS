import { useEffect, useMemo, useState } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocation } from '@/hooks/useLocation';
import type { District, Province, Ward } from '@/types/location.type';

interface LocationValue {
    provinceCode: number;
    districtCode: number;
    wardCode: number;
    displayText?: string;
}

interface LocationSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLocationSelect: (location: LocationValue) => void;
    initialValue?: Partial<LocationValue>;
}

interface SelectedLocation {
    province?: Province | undefined;
    district?: District | undefined;
    ward?: Ward | undefined;
}

export function LocationSelector({
    open,
    onOpenChange,
    onLocationSelect,
    initialValue
}: LocationSelectorProps) {
    const { provinces, getDistrictsByProvince, getWardsByDistrict } = useLocation();
    const [selected, setSelected] = useState<SelectedLocation>({});
    const [step, setStep] = useState<'province' | 'district' | 'ward'>('province');
    const [search, setSearch] = useState('');

    // Reset selection when modal opens
    useEffect(() => {
        if (open && !initialValue) {
            setSelected({});
            setStep('province');
        }
    }, [open, initialValue]);

    // Set initial value if provided
    useEffect(() => {
        if (initialValue?.provinceCode && open) {
            const province = provinces.find(p => p.code === initialValue.provinceCode);
            if (province) {
                setSelected(prev => ({ ...prev, province }));
                setStep('district');

                if (initialValue.districtCode) {
                    const districts = getDistrictsByProvince(province.code);
                    const district = districts.find(d => d.code === initialValue.districtCode);
                    if (district) {
                        setSelected(prev => ({ ...prev, district }));
                        setStep('ward');

                        if (initialValue.wardCode) {
                            const wards = getWardsByDistrict(province.code, district.code);
                            const ward = wards.find(w => w.code === initialValue.wardCode);
                            if (ward) {
                                setSelected(prev => ({ ...prev, ward }));
                            }
                        }
                    }
                }
            }
        }
    }, [initialValue, open, provinces, getDistrictsByProvince, getWardsByDistrict]);

    const districts = useMemo(() => {
        return selected.province ? getDistrictsByProvince(selected.province.code) : [];
    }, [selected.province, getDistrictsByProvince]);

    const wards = useMemo(() => {
        return selected.province && selected.district
            ? getWardsByDistrict(selected.province.code, selected.district.code)
            : [];
    }, [selected.province, selected.district, getWardsByDistrict]);

    const handleSelect = (item: Province | District | Ward) => {
        switch (step) {
            case 'province': {
                setSelected({
                    province: item as Province,
                    district: undefined,
                    ward: undefined
                } as SelectedLocation);
                setStep('district');
                break;
            }
            case 'district': {
                setSelected({
                    ...selected,
                    district: item as District,
                    ward: undefined
                } as SelectedLocation);
                setStep('ward');
                break;
            }
            case 'ward': {
                const ward = item as Ward;
                const displayText = `${ward.name}, ${selected.district?.name}, ${selected.province?.name}`;
                if (selected.province && selected.district) {
                    onLocationSelect({
                        provinceCode: selected.province.code,
                        districtCode: selected.district.code,
                        wardCode: ward.code,
                        displayText
                    });
                }
                onOpenChange(false);
                break;
            }
        }
    };

    const handleBack = () => {
        switch (step) {
            case 'ward':
                setStep('district');
                setSelected({ ...selected, ward: undefined });
                break;
            case 'district':
                setStep('province');
                setSelected({ province: selected.province });
                break;
        }
    };

    const filteredItems = useMemo(() => {
        let items: Array<Province | District | Ward>;
        switch (step) {
            case 'province':
                items = provinces;
                break;
            case 'district':
                items = districts;
                break;
            case 'ward':
                items = wards;
                break;
            default:
                items = [];
        }

        if (!search.trim()) return items;
        return items.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [step, provinces, districts, wards, search]);

    // Reset search when step changes
    useEffect(() => {
        setSearch('');
    }, [step]);

    const getTitle = () => {
        switch (step) {
            case 'province':
                return 'Chọn Tỉnh/Thành phố';
            case 'district':
                return `${selected.province?.name} > Chọn Quận/Huyện`;
            case 'ward':
                return `${selected.province?.name} > ${selected.district?.name} > Chọn Phường/Xã`;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-white border shadow-lg">
                <DialogHeader className="space-y-3 pb-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                        <MapPin className="h-5 w-5 text-primary" />
                        {getTitle()}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {step === 'province'
                            ? 'Chọn tỉnh hoặc thành phố của bạn'
                            : step === 'district'
                                ? 'Chọn quận hoặc huyện'
                                : 'Chọn phường hoặc xã'}
                    </DialogDescription>
                </DialogHeader>

                <div className="relative">
                    {step !== 'province' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground"
                            onClick={handleBack}
                        >
                            ← Quay lại
                        </Button>
                    )}

                    <div className="rounded-lg border border-input bg-card">
                        <div className="flex items-center border-b px-3 bg-muted/50">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <ScrollArea className="h-72">
                            <div className="p-2">
                                {filteredItems.length === 0 ? (
                                    <div className="py-6 text-center text-sm text-muted-foreground">
                                        Không tìm thấy kết quả.
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {filteredItems.map((item) => (
                                            <button
                                                key={item.code}
                                                onClick={() => handleSelect(item)}
                                                className="flex w-full items-center justify-between rounded-md px-4 py-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                                            >
                                                <span className="font-medium">{item.name}</span>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
