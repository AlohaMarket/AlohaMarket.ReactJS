import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/apis/products';
import { QUERY_KEYS } from '@/constants';
import type { MarketplaceListing } from '@/types';

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
