import { Subjects } from "../enums/subjects";
export interface AdminRoleCreatedEvent {
    subject: Subjects.AdminRoleCreated;
    data: {
        id: string;
        name: string;
    };
}
