import mongoose, { ObjectId } from "mongoose";
import { ProductDoc } from "./product";
import { SKUSDoc } from "./product-skus";

export interface CartAttrs {
    customerId: string;
    cartList: { productId: ProductDoc, productItemId?: SKUSDoc, purchaseQuantity: number }[]
}

// interface for usermodel pass
interface CartModel extends mongoose.Model<CartDoc> {
    build(attrs: CartAttrs): CartDoc;
}

// interface for single user properties
export interface CartDoc extends mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    customerId: string;
    cartList: { productId: ProductDoc, productItemId?: SKUSDoc | null, purchaseQuantity: number }[]
}

const CartSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerUser' },
    cartList: [{_id: false, 
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, 
        productItemId: { type: mongoose.Schema.Types.ObjectId || null, ref: 'SKUS' }, 
        purchaseQuantity: { type: Number } }]
}, );

CartSchema.pre('save', async function (done) { 
})
 
CartSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updated_at', updated_at);
    done();
})

CartSchema.statics.build = (attrs: CartAttrs) => {
    return new Cart(attrs);
}

const Cart = mongoose.model<CartDoc, CartModel>('Cart', CartSchema);

export { Cart };