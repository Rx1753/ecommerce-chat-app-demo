import { Subjects } from "../enums/subjects";
export interface ProductCategoryCreatedEvent {
    subject: Subjects.ProductCategoryCreated;
    data: {
        id: string;
        name: string;
        description: string;
        isActive: boolean;
        businessSubCategoryId: string;
    };
}
