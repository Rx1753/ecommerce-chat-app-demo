
import { Subjects,Publisher,ProductCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent>{
    subject: Subjects.ProductCreated=Subjects.ProductCreated;
}