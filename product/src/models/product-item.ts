import mongoose, { ObjectId } from "mongoose";
import { ProductDoc } from "./product";

// intetface that describe the prooerties
// that are required to cretae new category
export interface ProductItemAttrs {
    name: string;
    description: string;
    imageUrl: string;
    mrpPrice: number;
    quantity: number;
    productId: string;
    createdBy:string;
    
}

// interface for categorymodel pass
interface ProductItemModel extends mongoose.Model<ProductItemDoc> {
    build(attrs: ProductItemAttrs): ProductItemDoc;
}

// interface for single category properties
export interface ProductItemDoc extends mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string;
    isActive: boolean;
    imageUrl: string;
    mrpPrice: number;
    quantity: number;
    productId: ProductDoc;
    createdBy: string;
}

const ProductItemSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    imageUrl: { type: String },
    mrpPrice: { type: Number },
    quantity: { type: Number },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    createdBy:{type:String,},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

ProductItemSchema.pre('save', async function (done) {
    done();
})
ProductItemSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

ProductItemSchema.statics.build = (attrs: ProductItemAttrs) => {
    return new ProductItem(attrs);
}

const ProductItem = mongoose.model<ProductItemDoc, ProductItemModel>('ProductItem', ProductItemSchema);

export { ProductItem };