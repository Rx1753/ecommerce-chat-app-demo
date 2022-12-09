import { Subjects } from "../enums/subjects";
export interface BusinessCategoryCreatedEvent{
    subject:Subjects.BusinessCategoryCreated,
    data:{
        id:string,
        name:string,
        description:string,
        isActive:boolean,
    }
}