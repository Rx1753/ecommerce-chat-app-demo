import { Subjects } from "../enums/subjcts";

export interface PaymentCreatedEvent {
    subject : Subjects.paymentCreated ,
    data  :{
        id :string ;
        orderId :string ;
        stripeId :string ;
    }
}