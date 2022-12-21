
import { Subjects,Publisher,ProductUpdateEvent } from "@rx-ecommerce-chat/common_lib";

export class ProductUpdatedPublisher extends Publisher<ProductUpdateEvent>{
    subject: Subjects.ProductUpdated=Subjects.ProductUpdated;
}