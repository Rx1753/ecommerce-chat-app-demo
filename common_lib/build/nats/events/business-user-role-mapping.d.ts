import { Subjects } from '../enums/subjects';
export interface BusinessUserRoleMappingEvent {
    subject: Subjects.BusinessUserRoleMappingCreated;
    data: {
        id: string;
        businessUserId: string;
        businessRoleId: string;
    };
}
