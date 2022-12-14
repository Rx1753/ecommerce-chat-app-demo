import { Subjects,Publisher,InvitionCodeCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class InviteCodeCreatedPublisher extends Publisher<InvitionCodeCreatedEvent>{
    subject: Subjects.InvitionCodeCreated=Subjects.InvitionCodeCreated;
}