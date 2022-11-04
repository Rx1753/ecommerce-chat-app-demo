import { Subjects } from "../enums/subjcts";

export interface OrderCancelledEvent {
    subject : Subjects.OrderCancelled,
    data : {
        id: string,
        version : number
        productList: [{_id : string , purchaseQuantity: number}],
    }
}
