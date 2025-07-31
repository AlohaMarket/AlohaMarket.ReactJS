// File for constants to separate from component for Fast Refresh
export const PRODUCT_CONDITIONS = [
    { value: 'new', label: 'Mới' },
    { value: 'used_not_repaired', label: 'Đã qua sử dụng (chưa sửa chữa)' },
    { value: 'used_repaired', label: 'Đã qua sử dụng (đã sửa chữa)' },
] as const;

// Origin country options
export const ORIGIN_COUNTRIES = [
    { value: 'vietnam', label: 'Việt Nam' },
    { value: 'japan', label: 'Nhật Bản' },
    { value: 'china', label: 'Trung Quốc' },
    { value: 'eu', label: 'Châu Âu' },
    { value: 'usa', label: 'Hoa Kỳ' },
    { value: 'korea', label: 'Hàn Quốc' },
    { value: 'india', label: 'Ấn Độ' },
    { value: 'asean', label: 'ASEAN' },
    { value: 'other', label: 'Khác' },
] as const;

// Translations for both keys and values
export const ATTRIBUTE_TRANSLATIONS = {
    keys: {
        en: {
            brand: "Brand",
            condition: "Condition",
            warranty: "Warranty",
            warrantyMonths: "Warranty Period",
            origin: "Origin",
        },
        vi: {
            brand: "Thương hiệu",
            condition: "Tình trạng",
            warranty: "Bảo hành",
            warrantyMonths: "Thời gian bảo hành",
            origin: "Xuất xứ",
        }
    },
    values: {
        en: {
            // Conditions
            new: "New",
            used_not_repaired: "Used (not repaired)",
            used_repaired: "Used (repaired)",
            // Origins
            vietnam: "Vietnam",
            japan: "Japan",
            china: "China",
            eu: "European Union",
            usa: "United States",
            korea: "South Korea",
            india: "India",
            asean: "ASEAN",
            other: "Other",
            // Warranty
            "Yes": "Yes",
            "No": "No",
        },
        vi: {
            // Conditions
            new: "Mới",
            used_not_repaired: "Đã qua sử dụng (chưa sửa chữa)",
            used_repaired: "Đã qua sử dụng (đã sửa chữa)",
            // Origins
            vietnam: "Việt Nam",
            japan: "Nhật Bản",
            china: "Trung Quốc",
            eu: "Châu Âu",
            usa: "Hoa Kỳ",
            korea: "Hàn Quốc",
            india: "Ấn Độ",
            asean: "ASEAN",
            other: "Khác",
            // Warranty
            "Yes": "Có",
            "No": "Không",
        }
    }
};