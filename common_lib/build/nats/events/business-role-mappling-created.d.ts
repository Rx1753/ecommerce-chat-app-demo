import { Subjects } from "../enums/subjects";
export interface BBusinessRoleMappingCreatedEvent {
    subject: Subjects.BusinessRoleMappingCreated;
    data: {
        id: string;
        businessUserId: string;
        businessRoleId: string;
    };
}
