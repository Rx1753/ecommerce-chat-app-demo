import { ExpirationCompleteEvent, Listener, Subjects } from "@rx-ecommerce-chat/common_lib";
import { Message } from "node-nats-streaming";
import { queueGroup } from "./queue-group-name";
import { invitionCode } from "../../models/invition-code";
export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName: string = queueGroup;
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const inviteCodeData = await invitionCode.findById(data.Id);
        
       if(inviteCodeData){
        await invitionCode.findByIdAndDelete(data.Id);
       }
        msg.ack();
    }

}