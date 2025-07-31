import { useInfiniteQuery } from '@tanstack/react-query';
import { postsApi } from '@/apis/post';
import type { PostFilters } from '@/types/post.type';

export const useInfinitePosts = (filters: PostFilters = {}, pageSize: number = 10) => {
    return useInfiniteQuery({
        queryKey: ['posts', 'infinite', filters],
        queryFn: ({ pageParam = 1 }) => {
            return postsApi.getPosts({
                ...filters,
                page: pageParam,
                pageSize: pageSize
            });
        },
        getNextPageParam: (data, pages) => {
            // api returns co meta
            if (pages.length < Math.ceil(data.meta.total_pages)) {
                return pages.length + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        staleTime: 3 * 60 * 1000
    });
};