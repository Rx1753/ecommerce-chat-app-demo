
import { Subjects,Publisher,ProductCategoryCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class ProductCategoryCreatedPublisher extends Publisher<ProductCategoryCreatedEvent>{
    subject: Subjects.ProductCategoryCreated=Subjects.ProductCategoryCreated;
}