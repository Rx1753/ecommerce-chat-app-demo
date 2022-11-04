import { Subjects } from "../enums/subjcts";

export interface ExpirationCompleteEvent {
    subject : Subjects.ExpirationComplete;
    data : {
        orderId : string;
    }
}