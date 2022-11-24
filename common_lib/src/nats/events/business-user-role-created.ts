import {Subjects} from '../enums/subjects'
export interface BusinessUserRoleEvent{
    subject:Subjects.BusinessUserRoleCreated,
    data:{
        id:string;
        tableName: string;
        isRead: boolean;
        isCreate: boolean;
        isDelete: boolean;
        isUpdate: boolean;
    }

}