import { Subjects,Publisher,StateCreatedEvent } from "@rx-ecommerce-chat/common_lib";

export class StateCreatedPublisher extends Publisher<StateCreatedEvent>{
    subject: Subjects.StateCreated=Subjects.StateCreated;
}