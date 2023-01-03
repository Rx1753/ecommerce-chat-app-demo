import { Subjects } from "../enums/subjects";
export interface AdminRoleMappingCreatedEvent {
    subject: Subjects.AdminRoleMappingCreated;
    data: {
        id: string;
        roleId: string;
        permissionId: string;
    };
}
