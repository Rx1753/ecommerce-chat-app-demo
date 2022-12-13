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
    createdBy: string;

}

// interface for categorymodel pass
interface ProductItemModel extends mongoose.Model<ProductItemDoc> {
    build(attrs: ProductItemAttrs): ProductItemDoc;
}

// interface for single category properties
export interface ProductItemDoc extends mongoose.Document {
    name: string;
    description: string;
    imageUrl: string;
    mrpPrice: number;
    quantity: number;
    productId: ProductDoc;
    createdBy: string;
}

const ProductItemSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    mrpPrice: { type: Number },
    quantity: { type: Number },
    productId: { type: String, ref: 'Product' },
    createdBy: { type: String, },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.ProductItemId = ret._id;
            delete ret._id;
            delete ret.__v;
        },

    }
});

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