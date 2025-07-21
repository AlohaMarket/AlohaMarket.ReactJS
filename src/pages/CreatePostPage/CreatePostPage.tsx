import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Upload, MapPin, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Image as ImageIcon, Package, Sparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  title: yup
    .string()
    .required('Tiêu đề là bắt buộc')
    .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
    .max(100, 'Tiêu đề không được vượt quá 100 ký tự'),
  description: yup
    .string()
    .required('Mô tả là bắt buộc')
    .min(30, 'Mô tả phải có ít nhất 30 ký tự')
    .max(1000, 'Mô tả không được vượt quá 1000 ký tự'),
  price: yup.number().required('Giá là bắt buộc').min(0.01, 'Giá phải lớn hơn 0'),
  currency: yup.string().required('Currency is required').default('VND'),
  categoryId: yup.number().required('Danh mục là bắt buộc').min(1, 'Bạn cần chọn danh mục'),
  categoryPath: yup
    .array()
    .of(yup.number())
    .required('Danh mục là bắt buộc')
    .min(1, 'Bạn cần chọn danh mục'),
  provinceCode: yup
    .number()
    .required('Tỉnh/Thành phố là bắt buộc')
    .min(1, 'Bạn cần chọn Tỉnh/Thành phố'),
  districtCode: yup.number().required('Quận/Huyện là bắt buộc').min(1, 'Bạn cần chọn Quận/Huyện'),
  wardCode: yup.number().required('Phường/Xã là bắt buộc').min(1, 'Bạn cần chọn Phường/Xã'),
  userPlanId: yup.string().required('Bạn cần chọn gói đăng tin'),
  attributes: yup.object().default({}),
  images: yup
    .array()
    .of(yup.mixed<File>())
    .required(`Cần ít nhất 1 hình ảnh và tối đa ${IMAGE_CONFIG.maxImagesPerPost} hình ảnh`)
    .test(
      'fileList',
      `Cần ít nhất 1 hình ảnh và tối đa ${IMAGE_CONFIG.maxImagesPerPost} hình ảnh`,
      (value) => {
        if (!Array.isArray(value)) return false;
        return value.length > 0 && value.length <= IMAGE_CONFIG.maxImagesPerPost;
      }
    ),
}) as yup.ObjectSchema<CreatePostFormData>;

const CreatePostPage = () => {
  const { t } = useTranslation();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Partial<LocationValue>>({
    provinceCode: 0,
    districtCode: 0,
    wardCode: 0,
  });
  const navigate = useNavigate();
  const { categories } = useCategories();

  // Cải thiện query để tự động refresh và có staleTime ngắn hơn
  const {
    data: userPlans,
    isLoading: isLoadingPlans,
    refetch: refetchUserPlans,
  } = useQuery<UserPlanResponse[]>({
    queryKey: ['userPlans'],
    queryFn: async () => {
      const response = await userPlanApi.getCurrentUserPlans();
      return response;
    },
    staleTime: 30 * 1000, // 30 giây thay vì mặc định 5 phút
    refetchOnWindowFocus: true, // Tự động refetch khi user quay lại tab
    refetchInterval: 60 * 1000, // Tự động refetch mỗi 60 giây
  });

  const activePlans = userPlans?.filter((plan: UserPlanResponse) => plan.remainPosts > 0) || [];

  const queryClient = useQueryClient();

  // Track form submission state
  const [isPosting, setIsPosting] = useState(false);

  // Thêm useEffect để refresh user plans định kỳ
  useEffect(() => {
    const interval = setInterval(() => {
      refetchUserPlans();
    }, 30000); // 30 giây

    return () => clearInterval(interval);
  }, [refetchUserPlans]);

  // Thêm useEffect để invalidate cache khi trang được focus
  useEffect(() => {
    const handleFocus = () => {
      queryClient.invalidateQueries({ queryKey: ['userPlans'] });
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [queryClient]);

  // React Query mutation với cải thiện cache invalidation
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
      // Invalidate và refetch các cache liên quan
      queryClient.invalidateQueries({ queryKey: ['userPlans'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      // Optimistically update the cache with pending status
      const optimisticPost = {
        ...response,
        validationStatus: 'pending',
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
          items: [optimisticPost, ...old.items],
        };
      });

      // Show success toast
      toast.success('Bài đăng đã được tạo và đang được kiểm duyệt');

      setIsPosting(false); // Reset posting state

      // Refresh user plans sau khi tạo post thành công
      setTimeout(() => {
        refetchUserPlans();
      }, 1000);

      // Navigate to post status page instead of posts list
      navigate(`/post/${response.id}/status`);
    },
    onError: (error) => {
      console.error('Post creation error:', error);
      toast.error('Không thể tạo bài đăng. Đã có lỗi xảy ra, vui lòng thử lại sau');
      setIsPosting(false); // Reset posting state
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormData>({
    resolver: yupResolver(createPostSchema),
    defaultValues: {
      userPlanId: 'default',
      currency: 'VND',
      attributes: {},
      images: [],
    },
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
    const validFiles = newFiles.filter((file) => {
      // Check file type
      const isValidType = IMAGE_CONFIG.allowedTypes.some((type) =>
        file.type.startsWith(type.split('/')[0])
      );
      if (!isValidType) {
        toast.error(
          `File ${file.name} không đúng định dạng. Chỉ chấp nhận: ${IMAGE_CONFIG.allowedTypes.join(', ')}`
        );
        return false;
      }

      // Check file size
      if (file.size > IMAGE_CONFIG.maxSize) {
        toast.error(
          `File ${file.name} quá lớn. Kích thước tối đa: ${IMAGE_CONFIG.maxSize / (1024 * 1024)}MB`
        );
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

  const findCategoryPath = (
    categories: Category[],
    targetId: number,
    path: number[] = []
  ): number[] | null => {
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
      images: data.images.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Header Card */}
          <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-4 py-8">
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-3">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
                  {t('Tạo bài đăng mới')}
                </CardTitle>
                <CardDescription className="mt-2 text-lg text-gray-600">
                  {t('Chia sẻ sản phẩm của bạn với cộng đồng Aloha Market')}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          {/* Main Content Card */}
          <Card className="border-0 bg-white/90 shadow-xl backdrop-blur-sm">
            <CardContent className="space-y-10 p-8">
              {/* User Plan Selection với thêm nút refresh */}
              <div className="space-y-4">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-r from-orange-400 to-pink-500 p-2">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold text-gray-800">
                        Chọn gói đăng tin
                      </Label>
                      <p className="text-sm text-gray-500">Chọn gói phù hợp để đăng tin của bạn</p>
                    </div>
                  </div>

                  {/* Nút refresh user plans */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => refetchUserPlans()}
                    disabled={isLoadingPlans}
                    className="flex items-center gap-2"
                  >
                    <div className={`h-4 w-4 ${isLoadingPlans ? 'animate-spin' : ''}`}>🔄</div>
                    Làm mới
                  </Button>
                </div>

                <div className="relative">
                  <Select
                    onValueChange={(value) => setValue('userPlanId', value)}
                    value={watch('userPlanId')}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                      <SelectValue placeholder="Chọn gói đăng tin" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
                      {isLoadingPlans ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                            Đang tải...
                          </div>
                        </SelectItem>
                      ) : activePlans?.length === 0 ? (
                        <SelectItem value="no-plans" disabled>
                          <div className="text-gray-500">Không có gói đăng tin nào khả dụng</div>
                        </SelectItem>
                      ) : (
                        activePlans?.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id} className="rounded-lg">
                            <div className="flex w-full items-center justify-between">
                              <span className="font-medium">{plan.planName}</span>
                              <span className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-700">
                                Còn {plan.remainPosts} tin
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {errors.userPlanId && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <p className="text-sm font-medium text-red-600">{errors.userPlanId.message}</p>
                  </div>
                )}

                {activePlans?.length === 0 && (
                  <div className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-orange-100 p-2">
                        <Package className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-orange-800">Cần mua gói đăng tin</p>
                        <p className="text-sm text-orange-600">
                          Bạn cần{' '}
                          <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 font-semibold text-orange-600 underline hover:text-orange-800"
                            onClick={() => {
                              // Mở tab mới để không mất dữ liệu form
                              window.open('/payment/pro', '_blank');
                            }}
                          >
                            mua gói đăng tin
                          </Button>{' '}
                          để có thể đăng bài
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Images Section */}
              <div className="space-y-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 p-2">
                    <ImageIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <Label className="text-lg font-semibold text-gray-800">
                      {t('Hình ảnh sản phẩm')}
                    </Label>
                    <p className="text-sm text-gray-500">Thêm hình ảnh để tin đăng hấp dẫn hơn</p>
                  </div>
                </div>

                <input
                  type="file"
                  id="images"
                  multiple
                  accept={IMAGE_CONFIG.allowedTypes.join(',')}
                  className="hidden"
                  {...register('images')}
                  onChange={handleImageChange}
                />

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('images')?.click()}
                    className="group h-12 rounded-xl border-2 border-dashed border-gray-300 px-6 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50"
                  >
                    <Upload className="mr-3 h-5 w-5 transition-colors group-hover:text-blue-600" />
                    <span className="font-medium">{t('Tải ảnh lên')}</span>
                  </Button>

                  <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-gray-700">
                      {watch('images')?.length || 0}/{IMAGE_CONFIG.maxImagesPerPost}{' '}
                      {t('Ảnh đã chọn')}
                    </span>
                  </div>
                </div>

                {/* Image Guidelines */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium text-gray-800">Hướng dẫn tải ảnh:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      • Định dạng:{' '}
                      {IMAGE_CONFIG.allowedTypes.map((type) => type.split('/')[1]).join(', ')}
                    </p>
                    <p>• Kích thước tối đa: {IMAGE_CONFIG.maxSize / (1024 * 1024)}MB mỗi ảnh</p>
                    <p>• Số lượng: Tối đa {IMAGE_CONFIG.maxImagesPerPost} ảnh</p>
                  </div>
                </div>

                {/* Image Preview Grid */}
                {watch('images')?.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {watch('images').map((file, index) => (
                      <div key={index} className="group relative">
                        <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-sm">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="h-32 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-200 group-hover:bg-opacity-20"></div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -top-2 h-7 w-7 rounded-full opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {errors.images && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <p className="text-sm font-medium text-red-600">{errors.images.message}</p>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-8">
                {/* Title */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-base font-semibold text-gray-800">
                    {t('Tiêu đề')}
                  </Label>
                  <Input
                    id="title"
                    {...register('title')}
                    className="h-12 rounded-xl border-2 border-gray-200 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Nhập tiêu đề hấp dẫn cho tin đăng của bạn"
                  />
                  {errors.title && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <p className="text-sm font-medium text-red-600">{errors.title.message}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-semibold text-gray-800">
                    {t('Mô tả')}
                  </Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    className="min-h-32 resize-none rounded-xl border-2 border-gray-200 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Mô tả chi tiết về sản phẩm của bạn"
                  />
                  {errors.description && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <p className="text-sm font-medium text-red-600">
                        {errors.description.message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="categoryId">{t('Danh mục')}</Label>
                  <Select onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Mặt hàng của bạn thuộc danh mục nào')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-3">
                  <Label htmlFor="price" className="text-base font-semibold text-gray-800">
                    {t('Giá bán')}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">
                      ₫
                    </span>
                    <Input
                      id="price"
                      type="number"
                      className="h-12 rounded-xl border-2 border-gray-200 pl-10 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="0"
                      {...register('price')}
                    />
                  </div>
                  {errors.price && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <p className="text-sm font-medium text-red-600">{errors.price.message}</p>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-800">Vị trí</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="h-12 w-full justify-start rounded-xl border-2 border-gray-200 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50"
                  >
                    <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                    <span
                      className={selectedLocation.displayText ? 'text-gray-800' : 'text-gray-500'}
                    >
                      {selectedLocation.displayText || t('Chọn vị trí của sản phẩm')}
                    </span>
                  </Button>
                  {(errors.provinceCode || errors.districtCode || errors.wardCode) && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <p className="text-sm font-medium text-red-600">{t('Vị trí là bắt buộc')}</p>
                    </div>
                  )}
                </div>

                {/* Product Attributes */}
                <div className="border-t border-gray-200 pt-8">
                  <ProductAttributes
                    setValue={setValue}
                    getValues={getValues}
                    watch={watch}
                    control={control}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card className="border-0 bg-white/90 shadow-lg backdrop-blur-sm">
            <CardContent className="p-6">
              <Button
                type="submit"
                disabled={isSubmitting || isPosting}
                className="h-14 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting || isPosting ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>{t('common.submitting')}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    <span>{t('Đăng bài')}</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Location Selector */}
          <LocationSelector
            open={isLocationModalOpen}
            onOpenChange={setIsLocationModalOpen}
            onLocationSelect={handleLocationSelect}
            initialValue={selectedLocation}
          />
        </form>

        {/* Enhanced Loading Overlay */}
        {isPosting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                  <div
                    className="absolute inset-0 mx-auto h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-indigo-400"
                    style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                  ></div>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">Đang đăng tin...</h3>
                <p className="mb-6 text-gray-600">
                  Vui lòng đợi trong khi chúng tôi xử lý tin đăng của bạn.
                </p>
                <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 text-blue-800">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                    <span className="font-medium">Đang xử lý</span>
                  </div>
                  <p className="text-sm">
                    Hình ảnh đang được tải lên. Vui lòng không đóng trang này.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostPage;
