import { Subjects } from "../enums/subjects";
export interface ProductUpdateEvent {
    subject: Subjects.ProductUpdated;
    data: {
        id: string;
        name: string;
        description: string;
        productSubCategoryId: string;
        imageUrl: string;
        brandName: string;
        basePrice: number;
        mrpPrice: number;
        quantity: number;
        calculateOnBasePrice?: boolean;
        relatableProducts?: string[];
        createdBy: string;
        isActive: boolean;
    };
}
