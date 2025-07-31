import type { UserPlanResponse } from '@/types/userplan.type';
import { api } from './client';
import { API_ENDPOINTS } from '@/constants';

export const userPlanApi = {
    getUserPlans: (userId: string) =>
        api.get<UserPlanResponse[]>(API_ENDPOINTS.userPlans.list, { params: { userId } }),

    getCurrentUserPlans: () =>
        api.get<UserPlanResponse[]>(API_ENDPOINTS.userPlans.me),
};