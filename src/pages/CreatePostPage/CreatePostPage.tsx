import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Upload, MapPin, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { LocationSelector } from '@/components/LocationSelector/LocationSelector';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/apis/post';
import { userPlanApi } from '@/apis/userplan';
import type { PostCreateRequest, PostCreateResponse } from '@/types/post.type';
import type { Category } from '@/types/category.type';
import type { UserPlanResponse } from '@/types/userplan.type';
import type { LocationValue } from '@/components/LocationSelector/types';
import { IMAGE_CONFIG } from '@/constants';
import ProductAttributes from '@/components/ProductAttributes/ProductAttributes';

// Type definitions
export type CreatePostFormData = Omit<PostCreateRequest, 'images'> & {
    images: File[];
};

const createPostSchema = yup.object({
    title: yup.string().required('Tiêu đề là bắt buộc').min(10, 'Tiêu đề phải có ít nhất 10 ký tự').max(100, 'Tiêu đề không được vượt quá 100 ký tự'),
    description: yup.string().required('Mô tả là bắt buộc').min(30, 'Mô tả phải có ít nhất 30 ký tự').max(1000, 'Mô tả không được vượt quá 1000 ký tự'),
    price: yup.number().required('Giá là bắt buộc').min(0.01, 'Giá phải lớn hơn 0'),
    currency: yup.string().required('Currency is required').default('VND'),
    categoryId: yup.number().required('Danh mục là bắt buộc').min(1, 'Bạn cần chọn danh mục'),
    categoryPath: yup.array().of(yup.number()).required('Danh mục là bắt buộc').min(1, 'Bạn cần chọn danh mục'),
    provinceCode: yup.number().required('Tỉnh/Thành phố là bắt buộc').min(1, 'Bạn cần chọn Tỉnh/Thành phố'),
    districtCode: yup.number().required('Quận/Huyện là bắt buộc').min(1, 'Bạn cần chọn Quận/Huyện'),
    wardCode: yup.number().required('Phường/Xã là bắt buộc').min(1, 'Bạn cần chọn Phường/Xã'),
    userPlanId: yup.string().required('Bạn cần chọn gói đăng tin'),
    attributes: yup.object().default({}),
    images: yup
        .array()
        .of(yup.mixed<File>())
        .required(`Cần ít nhất 1 hình ảnh và tối đa ${IMAGE_CONFIG.maxImagesPerPost} hình ảnh`)
        .test('fileList', `Cần ít nhất 1 hình ảnh và tối đa ${IMAGE_CONFIG.maxImagesPerPost} hình ảnh`, (value) => {
            if (!Array.isArray(value)) return false;
            return value.length > 0 && value.length <= IMAGE_CONFIG.maxImagesPerPost;
        })
}) as yup.ObjectSchema<CreatePostFormData>;

const CreatePostPage = () => {
    const { t } = useTranslation();
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Partial<LocationValue>>({
        provinceCode: 0,
        districtCode: 0,
        wardCode: 0
    });
    const navigate = useNavigate();
    const { categories } = useCategories();
    const {
        data: userPlans,
        isLoading: isLoadingPlans
    } = useQuery<UserPlanResponse[]>({
        queryKey: ['userPlans'],
        queryFn: async () => {
            const response = await userPlanApi.getCurrentUserPlans();
            return response;
        }
    });

    const activePlans = userPlans?.filter((plan: UserPlanResponse) => plan.remainPosts > 0) || [];

    const queryClient = useQueryClient();

    // Track form submission state
    const [isPosting, setIsPosting] = useState(false);

    // React Query mutation
    const createPostMutation = useMutation({
        mutationFn: (data: CreatePostFormData) => {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (key === 'images') {
                    // Skip images, handle them separately
                    return;
                }

                if (key === 'categoryPath') {
                    // For categoryPath, append each number individually
                    if (Array.isArray(value)) {
                        value.forEach((item, index) => {
                            // Ensure we're working with numbers
                            const categoryId = typeof item === 'number' ? item : parseInt(String(item), 10);
                            formData.append(`${key}[${index}]`, String(categoryId));
                        });
                    }
                } else if (key === 'attributes') {
                    // Handle attributes object separately to ensure proper JSON serialization
                    const attributesValue = value as Record<string, unknown>;
                    if (Object.keys(attributesValue).length > 0) {
                        formData.append(key, JSON.stringify(attributesValue));
                    }
                } else if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (typeof value === 'object' && value !== null) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            });

            // Handle images
            data.images.forEach((file) => {
                formData.append('images', file);
            });

            return postsApi.createPost(formData);
        },
        onSuccess: (response: PostCreateResponse) => {
            // Optimistically update the cache with pending status
            const optimisticPost = {
                ...response,
                validationStatus: 'pending'
            };

            interface PostsCache {
                items: PostCreateResponse[];
                totalCount: number;
                page: number;
                pageSize: number;
                hasNextPage: boolean;
            }
            // Update the posts list cache
            queryClient.setQueryData(['posts'], (old: PostsCache | undefined) => {
                if (!old?.items) return old;
                return {
                    ...old,
                    items: [optimisticPost, ...old.items]
                };
            });

            // Show success toast
            toast.success('Bài đăng đã được tạo và đang được kiểm duyệt');

            setIsPosting(false); // Reset posting state
            // Navigate to post status page instead of posts list
            navigate(`/post/${response.id}/status`);
        },
        onError: (error) => {
            console.error('Post creation error:', error);
            toast.error('Không thể tạo bài đăng. Đã có lỗi xảy ra, vui lòng thử lại sau');
            setIsPosting(false); // Reset posting state
        },
    });

    const { register, handleSubmit, setValue, watch, getValues, control, formState: { errors, isSubmitting } } = useForm<CreatePostFormData>({
        resolver: yupResolver(createPostSchema),
        defaultValues: {
            userPlanId: 'default',
            currency: 'VND',
            attributes: {},
            images: []
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const currentImages = watch('images') || [];

        // Check if adding these new files would exceed the maximum allowed
        if (currentImages.length + newFiles.length > IMAGE_CONFIG.maxImagesPerPost) {
            toast.error(`Bạn chỉ có thể đăng tối đa ${IMAGE_CONFIG.maxImagesPerPost} hình ảnh.`);
            return;
        }

        // Validate each file
        const validFiles = newFiles.filter(file => {
            // Check file type
            const isValidType = IMAGE_CONFIG.allowedTypes.some(type =>
                file.type.startsWith(type.split('/')[0]));
            if (!isValidType) {
                toast.error(`File ${file.name} không đúng định dạng. Chỉ chấp nhận: ${IMAGE_CONFIG.allowedTypes.join(', ')}`);
                return false;
            }

            // Check file size
            if (file.size > IMAGE_CONFIG.maxSize) {
                toast.error(`File ${file.name} quá lớn. Kích thước tối đa: ${IMAGE_CONFIG.maxSize / (1024 * 1024)}MB`);
                return false;
            }

            return true;
        });

        setValue('images', [...currentImages, ...validFiles], { shouldValidate: true });
        e.target.value = ''; // Reset file input
    };

    const removeImage = (index: number) => {
        const currentImages = watch('images') || [];
        setValue(
            'images',
            currentImages.filter((_, i: number) => i !== index),
            { shouldValidate: true }
        );
    };

    const findCategoryPath = (categories: Category[], targetId: number, path: number[] = []): number[] | null => {
        for (const category of categories) {
            const categoryId = typeof category.id === 'string' ? parseInt(category.id, 10) : category.id;
            if (categoryId === targetId) {
                return [...path, categoryId];
            }
            if (category.children) {
                const foundPath = findCategoryPath(category.children, targetId, [...path, categoryId]);
                if (foundPath) return foundPath;
            }
        }
        return null;
    };

    const handleCategoryChange = (value: string) => {
        const categoryId = parseInt(value, 10);
        setValue('categoryId', categoryId);
        const categoryPath = findCategoryPath(categories || [], categoryId) || [categoryId];
        setValue('categoryPath', categoryPath);
    };

    const handleLocationSelect = (location: LocationValue) => {
        setSelectedLocation(location);
        setValue('provinceCode', location.provinceCode);
        setValue('districtCode', location.districtCode);
        setValue('wardCode', location.wardCode);
    };

    // Handle form submission
    const onSubmit = handleSubmit((data) => {
        console.log('Form Data:', {
            ...data,
            images: data.images.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            }))
        });
        setIsPosting(true); // Set posting state to true
        createPostMutation.mutate(data);
    });

    // Prevent page navigation during submission
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isPosting) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isPosting]);

    return (
        <div className="container py-8">
            <form onSubmit={onSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('createPost.title')}</CardTitle>
                        <CardDescription>{t('createPost.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* User Plan Selection */}
                        <div className="space-y-4">
                            <Label htmlFor="userPlanId">Chọn gói đăng tin</Label>
                            <Select
                                onValueChange={(value) => setValue('userPlanId', value)}
                                value={watch('userPlanId')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn gói đăng tin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingPlans ? (
                                        <SelectItem value="loading" disabled>Đang tải...</SelectItem>
                                    ) : activePlans?.length === 0 ? (
                                        <SelectItem value="no-plans" disabled>Không có gói đăng tin nào khả dụng</SelectItem>
                                    ) : (
                                        activePlans?.map((plan) => (
                                            <SelectItem key={plan.id} value={plan.id}>
                                                {plan.planName} - Còn {plan.remainPosts} tin
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.userPlanId && (
                                <p className="text-red-500 text-sm">{errors.userPlanId.message}</p>
                            )}
                            {activePlans?.length === 0 && (
                                <div className="text-sm text-orange-600">
                                    Bạn cần <a href="/payment/pro" className="text-orange-600 underline">mua gói đăng tin</a> để có thể đăng bài
                                </div>
                            )}
                        </div>

                        {/* Images section */}
                        <div className="space-y-4">
                            <Label htmlFor="images">{t('createPost.images')}</Label>
                            <input
                                type="file"
                                id="images"
                                multiple
                                accept={IMAGE_CONFIG.allowedTypes.join(',')}
                                className="hidden"
                                {...register('images')}
                                onChange={handleImageChange}
                            />
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('images')?.click()}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    {t('createPost.chooseImages')}
                                </Button>
                                <span className="text-sm text-gray-500">
                                    {watch('images')?.length || 0}/{IMAGE_CONFIG.maxImagesPerPost} {t('createPost.imagesSelected')}
                                </span>
                            </div>

                            {/* Image guidelines */}
                            <div className="text-xs text-gray-500">
                                <p>• Định dạng: {IMAGE_CONFIG.allowedTypes.map(type => type.split('/')[1]).join(', ')}</p>
                                <p>• Kích thước tối đa: {IMAGE_CONFIG.maxSize / (1024 * 1024)}MB mỗi ảnh</p>
                                <p>• Bạn có thể tải lên tối đa {IMAGE_CONFIG.maxImagesPerPost} ảnh</p>
                            </div>

                            {/* Image preview grid */}
                            {watch('images')?.length > 0 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {watch('images').map((file, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-6 w-6"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {errors.images && (
                                <p className="text-red-500 text-sm">{errors.images.message}</p>
                            )}
                        </div>

                        {/* Form fields */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">{t('createPost.titleLabel')}</Label>
                                <Input id="title" {...register('title')} />
                                {errors.title && (
                                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="description">{t('createPost.descriptionLabel')}</Label>
                                <Textarea id="description" {...register('description')} />
                                {errors.description && (
                                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="categoryId">{t('createPost.categoryLabel')}</Label>
                                <Select onValueChange={handleCategoryChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('createPost.selectCategory')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={String(category.id)}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoryId && (
                                    <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="price">{t('createPost.priceLabel')}</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2">₫</span>
                                    <Input
                                        id="price"
                                        type="number"
                                        className="pl-8"
                                        {...register('price')}
                                    />
                                </div>
                                {errors.price && (
                                    <p className="text-red-500 text-sm">{errors.price.message}</p>
                                )}
                            </div>

                            <div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsLocationModalOpen(true)}
                                    className="w-full justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>
                                            {selectedLocation.displayText || t('createPost.selectLocation')}
                                        </span>
                                    </div>
                                </Button>
                                {(errors.provinceCode || errors.districtCode || errors.wardCode) && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {t('createPost.locationRequired')}
                                    </p>
                                )}
                            </div>

                            {/* Product attributes section */}
                            <ProductAttributes
                                setValue={setValue}
                                getValues={getValues}
                                watch={watch}
                                control={control} // Add this line
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Submit button */}
                <Button
                    type="submit"
                    disabled={isSubmitting || isPosting}
                    className="w-full"
                >
                    {isSubmitting || isPosting ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('common.submitting')}
                        </div>
                    ) : (
                        t('createPost.submit')
                    )}
                </Button>

                {/* Location selector */}
                <LocationSelector
                    open={isLocationModalOpen}
                    onOpenChange={setIsLocationModalOpen}
                    onLocationSelect={handleLocationSelect}
                    initialValue={selectedLocation}
                />
            </form>

            {/* Full-page loading overlay */}
            {isPosting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                        <div className="text-center">
                            <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Đang đăng tin...</h3>
                            <p className="text-gray-600 mb-4">Vui lòng đợi trong khi chúng tôi đăng tin của bạn.</p>
                            <div className="bg-blue-50 text-blue-700 p-4 rounded-md text-sm">
                                <p>Hình ảnh đang được tải lên. Vui lòng không đóng trang này.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreatePostPage;
