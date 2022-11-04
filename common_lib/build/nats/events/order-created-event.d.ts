import { OrderStatus } from "../enums/order-status";
import { Subjects } from "../enums/subjcts";
export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string;
        version: number;
        status: OrderStatus;
        userId: string;
        expiresAt: string;
        productList: [{
            _id: string;
            purchaseQuantity: number;
        }];
        totalPrice: number;
    };
}
