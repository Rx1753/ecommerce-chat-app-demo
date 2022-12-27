import { Message } from "node-nats-streaming";
import { Subjects,Listener,ProductSubCategoryCreatedEvent } from "@rx-ecommerce-chat/common_lib";
import { queueGroup } from "./queue-group-name";
import { ProductSubCategory } from "../../models/product-sub-category";

export class ProductSubCategoryCreatedListener extends Listener<ProductSubCategoryCreatedEvent>{
    queueGroupName=queueGroup;
    subject: Subjects.ProductSubCategoryCreated=Subjects.ProductSubCategoryCreated;
    async onMessage(data:ProductSubCategoryCreatedEvent['data'],msg:Message){
         const {id,name,description,productCategoryId,isActive}=data
         const productSubCategoryData = ProductSubCategory.build({
            name:name,
            description:description,
            productCategoryId:productCategoryId,
            isActive:isActive
         })
         productSubCategoryData._id=id
         await productSubCategoryData.save();
         msg.ack();
    }
}
    