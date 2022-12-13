import { Subjects } from "../enums/subjects";
export interface ProductItemCreatedEvent {
    subject: Subjects.ProductItemCreated;
    data: {
        id: string;
        name: string;
        description: string;
        imageUrl: string;
        mrpPrice: number;
        quantity: number;
        productId: string;
        createdBy: string;
    };
}
