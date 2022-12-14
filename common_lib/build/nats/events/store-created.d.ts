import { Subjects } from "../enums/subjects";
export interface StoreCreatedEvent {
    subject: Subjects.StoreCreated;
    data: {
        id: string;
        phoneNumber: number;
        email: string;
        businessProfileId: string;
        businessSubCategoryId: string;
        description: string;
        name: string;
        latitude: number;
        longitude: number;
        city: string;
        state: string;
        country: string;
        pinCode: number;
        imageUrl: string;
        addressLine1: string;
        addressLine2?: string;
        membershipId?: string;
        welcomeMessage?: string;
        createdBy: string;
    };
}
