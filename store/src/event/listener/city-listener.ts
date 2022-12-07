import { Message } from "node-nats-streaming";
import { Subjects,Listener,CityCreatedEvent } from "@rx-ecommerce-chat/common_lib";
import { City } from "../../models/city";
import { queueGroup } from "./queue-group-name";

export class CityCreatedListener extends Listener<CityCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.CityCreated=Subjects.CityCreated;
    async onMessage(data:CityCreatedEvent['data'],msg:Message){
         const {id,cityName,stateId}=data
         const cityData = City.build({
           cityName:cityName,
           stateId:stateId
         })
         cityData._id=id;
         await cityData.save();
         msg.ack();
    }
}
    