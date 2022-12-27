import { Subjects } from "../enums/subjects";
export interface ProductSubCategoryCreatedEvent {
    subject: Subjects.ProductSubCategoryCreated;
    data: {
        id: string;
        name: string;
        description: string;
        isActive: boolean;
        productCategoryId: string;
    };
}
