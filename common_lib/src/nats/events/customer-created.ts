import { Subjects } from "../enums/subjects";
export interface CustomerCreatedEvent {
    subject: Subjects.CustomerCreated,
    data: {
        id: string,
        email?: string | null;
        phoneNumber?: number | null;
        name: string;
    }
}