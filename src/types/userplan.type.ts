export interface UserPlanResponse {
    id: string;
    userId: string;
    planId: number;
    planName: string;
    startDate: string;
    endDate: string;
    remainPosts: number;
    remainPushes: number;
    isActive: boolean;
}