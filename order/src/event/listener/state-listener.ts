import { Message } from "node-nats-streaming";
import { Subjects,Listener,StateCreatedEvent } from "@rx-ecommerce-chat/common_lib";
import { State } from "../../models/state";
import { queueGroup } from "./queue-group-name";

export class StateCreatedListener extends Listener<StateCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.StateCreated=Subjects.StateCreated;
    async onMessage(data:StateCreatedEvent['data'],msg:Message){
         const {id,stateName,countryId}=data
         const stateData = State.build({
           stateName:stateName,
           countryId:countryId
         })
         stateData._id=id
         await stateData.save();
         msg.ack();
    }
}
    