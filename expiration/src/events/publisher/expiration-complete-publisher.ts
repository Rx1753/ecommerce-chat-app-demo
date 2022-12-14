import { ExpirationCompleteEvent, Publisher, Subjects } from "@rx-ecommerce-chat/common_lib";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
   
}