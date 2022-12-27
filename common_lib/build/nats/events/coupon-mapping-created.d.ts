import { Subjects } from "../enums/subjects";
export interface CouponMappingCreatedEvent {
    subject: Subjects.CouponMappingCreated;
    data: {
        id: string;
        couponId: string;
        isProduct: boolean;
        isCustomer: boolean;
        isStore: boolean;
        isProductCategory: boolean;
        isProductSubCategory: boolean;
        baseId: string;
        baseType: string;
    };
}
