import { Subjects } from "../enums/subjcts";

export interface ProductCreatedEvent {
    subject: Subjects.ProductCreated;
    data: {
        id: string;
        version: number
        name: string;
        price: number;
        quantity : number;
        userId: string;
        available : boolean
    }
}