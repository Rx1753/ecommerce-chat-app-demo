import { Subjects } from "../enums/subjects";
export interface BusinessSubCategoryCreatedEvent {
    subject: Subjects.BusinessSubCategoryCreated;
    data: {
        id: string;
        name: string;
        description: string;
        isActive: boolean;
        businessCategoryId: string;
    };
}
