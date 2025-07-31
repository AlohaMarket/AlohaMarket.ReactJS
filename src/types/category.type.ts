export interface Category {
    id: number | string;                    // Changed from string to number
    name: string;
    displayName: string;
    description: string;           // Made required to match backend
    parentId: number | string;              // Changed from string to number, made required
    level: number;
    sortOrder: number;
    children: Category[];          // Made required to match backend
}
