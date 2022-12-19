import {  Subjects,Publisher,AdminUserUpdatedEvent } from "@rx-ecommerce-chat/common_lib";

export class AdminUpdatedPublisher extends Publisher<AdminUserUpdatedEvent>{
    subject: Subjects.AdminUserUpdated=Subjects.AdminUserUpdated;
}