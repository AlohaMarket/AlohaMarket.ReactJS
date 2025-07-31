export interface LocationValue {
    provinceCode: number;
    districtCode: number;
    wardCode: number;
    displayText?: string;
}

export interface LocationSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLocationSelect: (location: LocationValue) => void;
    initialValue?: Partial<LocationValue>;
}
