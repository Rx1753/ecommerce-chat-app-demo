import { Subjects } from "../enums/subjects";
export interface BusinessUserCreatedEvent {
    subject: Subjects.BusinessUserCreated;
    data: {
        id: string;
        version: number;
        email: string;
        phoneNumber: number;
        name: string;
        isActive: boolean;
        createdBy: string;
        refreshToken: string;
    };
}
