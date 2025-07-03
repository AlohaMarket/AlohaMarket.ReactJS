import type { LocationType } from "./location.type";

export interface PostCreateResponse {
    id: string;
    userId: string;
    userPlanId: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    categoryId: number;
    categoryPath: number[];
    provinceCode: number;
    provinceText: string | null;
    districtCode: number;
    districtText: string | null;
    wardCode: number;
    wardText: string | null;
    isActive: boolean;
    priority: number;
    isViolation: boolean;
    createdAt: string;
    updatedAt: string;
    pushedAt: string | null;
    attributes: Record<string, string>;
    isLocationValid: boolean;
    isCategoryValid: boolean;
    isUserPlanValid: boolean;
    status: PostStatus;
    locationValidationMessage: string | null;
    categoryValidationMessage: string | null;
    userPlanValidationMessage: string | null;
    images: PostImageResponse[];
}

export interface PostDetailResponse {
    id: string;
    userId: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    provinceText: string | null;
    districtText: string | null;
    wardText: string | null;
    attributes: Record<string, string>;
    images: PostImageResponse[];
    categoryId: number | string;
    provinceCode: number | string;
    districtCode: number | string;
    wardCode: number | string;
    createdAt: string;
    categoryPath: number[];
}

export interface PostListResponse {
    id: string;
    userId: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    provinceText: string | null;
    districtText: string | null;
    wardText: string | null;
    image: PostImageResponse;
}

export interface PostImageResponse {
    imageUrl: string;
    order: number;
}

export enum PostStatus {
    PendingValidation = 'PendingValidation',
    Validated = 'Validated',
    Invalid = 'Invalid',
    Rejected = 'Rejected',
    Archived = 'Archived',
    Deleted = 'Deleted'
}

// Update the PostFilters interface to match backend parameters
export interface PostFilters {
    page?: number | string | undefined;
    pageSize?: number | string | undefined;
    searchTerm?: string | undefined;
    locationId?: number | string | undefined;
    locationLevel?: LocationType | undefined;
    categoryId?: number | string | undefined;
    minPrice?: number | string | undefined;
    maxPrice?: number | string | undefined;
    order?: 'asc' | 'desc' | undefined;
    sortBy?: 'createdAt' | 'price' | undefined;
}

export interface PostCreateRequest {
    userPlanId: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    categoryId: number;
    categoryPath: number[];
    provinceCode: number;
    districtCode: number;
    wardCode: number;
    attributes: Record<string, string>;
}