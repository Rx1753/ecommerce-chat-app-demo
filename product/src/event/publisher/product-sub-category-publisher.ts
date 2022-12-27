
import { Subjects,Publisher,ProductSubCategoryCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class ProductSubCategoryCreatedPublisher extends Publisher<ProductSubCategoryCreatedEvent>{
    subject: Subjects.ProductSubCategoryCreated=Subjects.ProductSubCategoryCreated;
}