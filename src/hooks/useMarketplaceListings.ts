import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { productsApi } from '@/apis/products';
import { QUERY_KEYS } from '@/constants';

export function useMarketplaceListings(limit?: number) {
  return useQuery({
    queryKey: [...QUERY_KEYS.featuredProducts, limit],
    queryFn: () => productsApi.getMarketplaceListings(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (updated from deprecated cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useInfiniteMarketplaceListings(limit: number = 8) {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.featuredProducts, 'infinite', limit],
    queryFn: ({ pageParam = 1 }) => productsApi.getMarketplaceListings(limit, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has data and is equal to the limit, there might be more pages
      if (lastPage.length === limit) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
