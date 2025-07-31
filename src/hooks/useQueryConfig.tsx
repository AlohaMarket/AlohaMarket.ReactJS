import { type PostFilters } from '@/types/post.type';
import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';
import useQueryParams from './useQueryParams';

export type QueryConfig = {
    [key in keyof PostFilters]: string
}

const defaultQueryConfig: QueryConfig = {
    page: '1',
    pageSize: '20',
    sortBy: 'createdAt',
    order: 'desc'
};

export default function useQueryConfig() {
    const queryParams: QueryConfig = useQueryParams();
    const queryConfig: QueryConfig = omitBy(
        {
            page: queryParams.page || defaultQueryConfig.page,
            pageSize: queryParams.pageSize || defaultQueryConfig.pageSize,
            categoryId: queryParams.categoryId,
            searchTerm: queryParams.searchTerm,
            locationId: queryParams.locationId,
            locationLevel: queryParams.locationLevel,
            minPrice: queryParams.minPrice,
            maxPrice: queryParams.maxPrice,
            sortBy: queryParams.sortBy || defaultQueryConfig.sortBy,
            order: queryParams.order || defaultQueryConfig.order
        },
        isUndefined
    );
    return queryConfig;
}