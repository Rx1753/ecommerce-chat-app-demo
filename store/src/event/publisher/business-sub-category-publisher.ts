import { Subjects,Publisher,BusinessSubCategoryCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class BusinessSubCategoryCreatedPublisher extends Publisher<BusinessSubCategoryCreatedEvent>{
    subject: Subjects.BusinessSubCategoryCreated=Subjects.BusinessSubCategoryCreated;
}