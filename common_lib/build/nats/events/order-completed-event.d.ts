import { Subjects } from "../enums/subjcts";
export interface OrderCompletedEvent {
    subject: Subjects.OrderCompleted;
    data: {
        id: string;
    };
}
