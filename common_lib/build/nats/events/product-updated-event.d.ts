import { Subjects } from "../enums/subjcts";
export interface ProductUpdatedEvent {
    subject: Subjects.ProductUpdated;
    data: {
        id: string;
        version: number;
        name: string;
        price: number;
        quantity: number;
        userId: string;
        available: boolean;
    };
}
