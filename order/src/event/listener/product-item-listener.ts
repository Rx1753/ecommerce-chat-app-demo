import { Message } from "node-nats-streaming";
import { Subjects, Listener, ProductItemCreatedEvent } from "@rx-ecommerce-chat/common_lib";
import { ProductItem } from "../../models/product-item";
import { queueGroup } from "./queue-group-name";

export class ProductItemCreatedListener extends Listener<ProductItemCreatedEvent>{
    queueGroupName = queueGroup;
    subject: Subjects.ProductItemCreated = Subjects.ProductItemCreated;
    async onMessage(data: ProductItemCreatedEvent['data'], msg: Message) {
        const { id, name, description, imageUrl, mrpPrice, quantity, productId, createdBy } = data
        const userData = ProductItem.build({
            name,
            description,
            imageUrl,
            mrpPrice,
            quantity,
            productId,
            createdBy
        })
        userData._id = id
        await userData.save();
        msg.ack();
    }
}
