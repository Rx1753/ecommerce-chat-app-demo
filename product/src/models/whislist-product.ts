import mongoose, { ObjectId } from "mongoose";
import { BusinessSubCategoryDoc } from "./business-sub-category";
// name String
//   description String
//   isActive Boolean
//   createdAt Date
//   updatedAt Date
// intetface that describe the prooerties
// that are required to cretae new category
export interface ProductWhishlistAttrs {
    customerId:string;
    productId:string;
}

// interface for categorymodel pass
interface ProductWhishlistModel extends mongoose.Model<ProductWhishlistDoc> {
    build(attrs: ProductWhishlistAttrs): ProductWhishlistDoc;
}

// interface for single category properties
export interface ProductWhishlistDoc extends mongoose.Document {
    name: any;
    isActive: any;
    businessSubCategoryId: any;
    createdAt: Date;
    updatedAt: Date;
    customerId:string;
    productId:string;
}

const ProductWhishlistSchema = new mongoose.Schema({
    customerId:{type:String,},
    productId:{type:String},
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.ProductWhishlistId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },

    }
});

ProductWhishlistSchema.pre('save', async function (done) {
    done();
})
ProductWhishlistSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

ProductWhishlistSchema.statics.build = (attrs: ProductWhishlistAttrs) => {
    return new ProductWhishlist(attrs);
}

const ProductWhishlist = mongoose.model<ProductWhishlistDoc, ProductWhishlistModel>('ProductWhishlist', ProductWhishlistSchema);

export { ProductWhishlist };