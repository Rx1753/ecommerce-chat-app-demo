import { Subjects,Publisher,BusinessCategoryUpdatedEvent } from "@rx-ecommerce-chat/common_lib";

export class BusinessCategoryUpdatePublisher extends Publisher<BusinessCategoryUpdatedEvent>{
    subject: Subjects.BusinessCategoryUpdated=Subjects.BusinessCategoryUpdated;
}