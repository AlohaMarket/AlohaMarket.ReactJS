import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PRODUCT_CONDITIONS, ORIGIN_COUNTRIES } from '@/constants/productAttributes';
import type { UseFormSetValue, UseFormGetValues, UseFormWatch, Control } from 'react-hook-form';
import type { PostCreateRequest } from '@/types/post.type';

type CreatePostFormData = Omit<PostCreateRequest, 'images'> & {
    images: File[];
};

interface ProductAttributesProps {
    setValue: UseFormSetValue<CreatePostFormData>;
    getValues: UseFormGetValues<CreatePostFormData>;
    watch: UseFormWatch<CreatePostFormData>;
    control: Control<CreatePostFormData>; // Add control prop
}

const ProductAttributes = ({
    setValue,
    getValues,
    watch,
    control
}: ProductAttributesProps) => {
    const { t } = useTranslation();
    const [hasWarranty, setHasWarranty] = useState(false);
    const attributes = watch('attributes') as Record<string, string>;

    const updateAttributes = useCallback((key: string, value: string) => {
        const currentAttributes = getValues('attributes') || {};
        setValue('attributes', {
            ...currentAttributes,
            [key]: value
        }, { shouldValidate: true });
    }, [getValues, setValue]);

    // Initialize hasWarranty state from form data
    useEffect(() => {
        const warranty = attributes?.['warranty'];
        setHasWarranty(warranty === 'Yes');
    }, [attributes?.['warranty']]);

    return (
        <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium text-lg">{t('createPost.attributesTitle', 'Thông tin sản phẩm')}</h3>

            {/* Brand */}
            <div>
                <Label htmlFor="brand">Thương hiệu</Label>
                <Input
                    id="brand"
                    placeholder="Nhập thương hiệu"
                    value={attributes?.['brand'] || ''}
                    onChange={(e) => updateAttributes('brand', e.target.value)}
                />
            </div>

            {/* Condition */}
            <div>
                <Label htmlFor="condition">Tình trạng</Label>
                <Select
                    value={attributes?.['condition'] || ''}
                    onValueChange={(value) => updateAttributes('condition', value)}
                >
                    <SelectTrigger id="condition">
                        <SelectValue placeholder="Chọn tình trạng" />
                    </SelectTrigger>
                    <SelectContent>
                        {PRODUCT_CONDITIONS.map((condition) => (
                            <SelectItem key={condition.value} value={condition.value}>
                                {condition.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Origin */}
            <div>
                <Label htmlFor="origin">Xuất xứ</Label>
                <Select
                    value={attributes?.['origin'] || ''}
                    onValueChange={(value) => updateAttributes('origin', value)}
                >
                    <SelectTrigger id="origin">
                        <SelectValue placeholder="Chọn xuất xứ" />
                    </SelectTrigger>
                    <SelectContent>
                        {ORIGIN_COUNTRIES.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                                {country.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Warranty */}
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="hasWarranty"
                        checked={hasWarranty}
                        onCheckedChange={(checked) => {
                            setHasWarranty(!!checked);
                            updateAttributes('warranty', checked ? 'Yes' : 'No');
                        }}
                    />
                    <Label htmlFor="hasWarranty" className="cursor-pointer">
                        Còn bảo hành
                    </Label>
                </div>

                {hasWarranty && (
                    <div className="ml-6 mt-2">
                        <Label htmlFor="warrantyMonths">Thời gian bảo hành (tháng)</Label>
                        <Input
                            id="warrantyMonths"
                            type="number"
                            min="1"
                            placeholder="Nhập số tháng bảo hành"
                            value={attributes?.['warrantyMonths'] || ''}
                            onChange={(e) => updateAttributes('warrantyMonths', e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductAttributes;
