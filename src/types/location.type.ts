export interface Province {
    name: string;
    code: number;
    districts: District[];
}

export interface District {
    name: string;
    code: number;
    wards: Ward[];
}

export interface Ward {
    name: string;
    code: number;
}

export enum LocationType {
    PROVINCE = 'province',
    DISTRICT = 'district',
    WARD = 'ward',
}