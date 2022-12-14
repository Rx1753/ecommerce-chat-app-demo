import { Subjects } from "../enums/subjects";
export interface BusinessRoleTypeCreatedEvent {
    subject: Subjects.BusinessRoleTypeCreated;
    data: {
        id: string;
        tableName: string;
        isRead: boolean;
        isCreate: boolean;
        isDelete: boolean;
        isUpdate: boolean;
    };
}
