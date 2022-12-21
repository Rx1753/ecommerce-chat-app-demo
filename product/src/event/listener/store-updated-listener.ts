import { Message } from "node-nats-streaming";
import { Subjects, Listener, StoreUpdatedEvent } from "@rx-ecommerce-chat/common_lib";
import { Store } from "../../models/store";
import { queueGroup } from "./queue-group-name";
import { Product } from "../../models/product";
import { ProductCreatedPublisher } from "../publisher/product-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { ProductUpdatedPublisher } from "../publisher/product-update-publisher";

export class StoreUpdatedListener extends Listener<StoreUpdatedEvent>{
    queueGroupName = queueGroup;
    subject: Subjects.StoreUpdated = Subjects.StoreUpdated;
    async onMessage(data: StoreUpdatedEvent['data'], msg: Message) {
        const { id,
            phoneNumber,
            email,
            businessProfileId,
            businessSubCategoryId,
            description,
            name,
            isActive,
            createdBy } = data
        const storeData=await Store.findByIdAndUpdate(id,{phoneNumber:phoneNumber,email:email,businessProfileId:businessProfileId,businessSubCategoryId:businessSubCategoryId,description:description,name:name,isActive:isActive,createdBy:createdBy}) 
        if(isActive==false){            
            await Product.updateMany({storeId:id},{$set:{isActive:false}});
            const productData = await Product.find({storeId:id});
            productData.forEach((e:any)=>{
                new ProductUpdatedPublisher(natsWrapper.client).publish({
                    id: e.name,
                    name: e.name,
                    description: e.description,
                    productSubCategoryId: e.productSubCategoryId,
                    imageUrl: e.imageUrl,
                    brandName: e.brandName,
                    basePrice: e.basePrice,
                    mrpPrice: e.mrpPrice,
                    quantity: e.quantity,
                    createdBy: e.createdBy,
                    isActive: e.isActive
                })
            })
        }
        msg.ack();

    }
}
