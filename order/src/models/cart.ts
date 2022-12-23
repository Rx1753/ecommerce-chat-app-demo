import mongoose, { ObjectId } from "mongoose";

// import { BusinessProfileDoc } from "./business-profile";
// import { BusinessSubCategoryDoc } from "./business-sub-category";

// intetface that describe the prooerties
// that are required to cretae new user
export interface CartAttrs {
    customerId: string;
    cartList: { _id: string, productItemId?: string, purchaseQuantity: number }[]
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
    cartList: { productId: string, productItemId?: string, purchaseQuantity: number }[]
}

const CartSchema = new mongoose.Schema({
    customerId: { type: String, ref: 'CustomerUser' },
    cartList: [{_id: false, productId: { type: String, ref: 'Product' }, productItemId: { type: String, ref: 'ProductItem' }, purchaseQuantity: { type: Number } }]
}, {
    toJSON: {
        transform(doc, ret) {
            ret.CartId = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    }
});

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