import { Subjects,Publisher,BusinessSubCategoryUpdatedEvent } from "@rx-ecommerce-chat/common_lib";

export class BusinessSubCategoryUpdatePublisher extends Publisher<BusinessSubCategoryUpdatedEvent>{
    subject: Subjects.BusinessSubCategoryUpdated=Subjects.BusinessSubCategoryUpdated;
}