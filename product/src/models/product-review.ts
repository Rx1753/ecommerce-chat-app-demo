import mongoose, { ObjectId } from "mongoose";
import { Password } from "../services/password";

// intetface that describe the prooerties
// that are required to cretae new user
export interface ProductReviewAttrs {
   productId:string;
   rate:number;
   comment:string;
   imageURL:string[];
}

// interface for usermodel pass
interface ProductReviewModel extends mongoose.Model<ProductReviewDoc> {
    build(attrs: ProductReviewAttrs): ProductReviewDoc;
}

// interface for single user properties
export interface ProductReviewDoc extends mongoose.Document {
    productId:string;
    rate:number;
    comment:string;
    imageURL:string[];
}

const ProductReviewSchema = new mongoose.Schema({
    productId: { type: String},
    rate: { type: Number  },
    comment: { type: String },
    imageURL:[{type:String}],
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.ProductReviewId = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    }
});

ProductReviewSchema.pre('save', async function (done) {

})
ProductReviewSchema.pre('update', async function (done) {

})

ProductReviewSchema.statics.build = (attrs: ProductReviewAttrs) => {
    return new ProductReview(attrs);
}

const ProductReview = mongoose.model<ProductReviewDoc, ProductReviewModel>('ProductReview', ProductReviewSchema);

export { ProductReview };