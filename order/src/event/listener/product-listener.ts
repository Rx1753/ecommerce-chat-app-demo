import { Message } from "node-nats-streaming";
import { Subjects, Listener, ProductCreatedEvent } from "@rx-ecommerce-chat/common_lib";
import { Product } from "../../models/product";
import { queueGroup } from "./queue-group-name";

export class ProductCreatedListener extends Listener<ProductCreatedEvent>{
    queueGroupName = queueGroup;
    subject: Subjects.ProductCreated = Subjects.ProductCreated;
    async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
        const { id, name, description, productSubCategoryId,imageUrl,storeId,brandName,basePrice,mrpPrice,quantity,calculateOnBasePrice,relatableProducts,createdBy} = data
        const userData = Product.build({
            name: name,
            description: description,
            productSubCategoryId: productSubCategoryId,
            imageUrl: [imageUrl],
            storeId: storeId,
            brandName: brandName,
            highlights: "",
            basePrice: basePrice,
            quantity: quantity,
            createdBy: createdBy,
            isDiscountPercentage: false,
            discount: 0,
            discountedValue: 0,
            maxDiscount: 0
        })
        userData._id = id
        await userData.save();
        msg.ack();
    }
}
