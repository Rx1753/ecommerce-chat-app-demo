import { Subjects,Publisher,BusinessCategoryCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class BusinessCategoryCreatedPublisher extends Publisher<BusinessCategoryCreatedEvent>{
    subject: Subjects.BusinessCategoryCreated=Subjects.BusinessCategoryCreated;
}