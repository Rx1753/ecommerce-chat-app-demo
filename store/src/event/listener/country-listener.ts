import { Message } from "node-nats-streaming";
import { Subjects,Listener,CountryCreatedEvent } from "@rx-ecommerce-chat/common_lib";
import { Country } from "../../models/country";
import { queueGroup } from "./queue-group-name";

export class CountryCreatedListener extends Listener<CountryCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.CountryCreated=Subjects.CountryCreated;
    async onMessage(data:CountryCreatedEvent['data'],msg:Message){
         const {id,countryName}=data
         const countryData = Country.build({
           countryName:countryName,
         })
         countryData._id=id
         await countryData.save();
         msg.ack();
    }
}
    