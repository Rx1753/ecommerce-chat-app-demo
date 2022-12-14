import { Subjects } from "../enums/subjects";
export interface InvitionCodeCreatedEvent{
    subject:Subjects.InvitionCodeCreated,
    data:{
        type: string;
        phoneNumber?: Number;
        email?: string;
        userId?:string;
        code: String;
    }
}