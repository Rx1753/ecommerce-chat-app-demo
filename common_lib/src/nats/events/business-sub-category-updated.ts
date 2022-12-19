import { Subjects } from "../enums/subjects";
export interface BusinessSubCategoryUpdatedEvent{
    subject:Subjects.BusinessSubCategoryUpdated,
    data:{
        id:string,
        name:string,
        description:string,
        isActive:boolean,
        businessCategoryId:string
    }
}