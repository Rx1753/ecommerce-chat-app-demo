import { Subjects } from "../enums/subjects";
export interface BusinessCategoryUpdatedEvent{
    subject:Subjects.BusinessCategoryUpdated,
    data:{
        id:string,
        name:string,
        description:string,
        isActive:boolean,
    }
}