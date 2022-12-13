
import { Subjects,Publisher,ProductItemCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class ProductItemCreatedPublisher extends Publisher<ProductItemCreatedEvent>{
    subject: Subjects.ProductItemCreated=Subjects.ProductItemCreated;
}