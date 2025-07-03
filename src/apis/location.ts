import { API_ENDPOINTS } from "@/constants";
import type { Province } from "@/types/location.type";
import { api } from "./client";

// Location API
export const locationApi = {
    // Get location tree, with provinces include districts and wards
    getLocationTree: (): Promise<Province[]> =>
        api.get<Province[]>(API_ENDPOINTS.location.tree),
};