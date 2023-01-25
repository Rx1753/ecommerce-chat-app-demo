import mongoose, { ObjectId } from "mongoose";
import { CustomerDoc } from "./customer";

// intetface that describe the prooerties
// that are required to cretae new user
export interface ProductReviewAttrs {
   productId:string;
   customerId:string;
   rate:number;
   comment:string;
   title:string;
   imageURL:string[];
}

// interface for usermodel pass
interface ProductReviewModel extends mongoose.Model<ProductReviewDoc> {
    build(attrs: ProductReviewAttrs): ProductReviewDoc;
}

// interface for single user properties
export interface ProductReviewDoc extends mongoose.Document {
    customerId:CustomerDoc;
    productId:string;
    rate:number;
    comment:string;
    title:string,
    imageURL:string[];
}

const ProductReviewSchema = new mongoose.Schema({
    customerId:{type:String,ref:'CustomerUser'},
    productId: { type: String},
    title:{type:String},
    rate: { type: Number,default:1.1 },
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
    done();
})
ProductReviewSchema.pre('update', async function (done) {
    done();
})

ProductReviewSchema.statics.build = (attrs: ProductReviewAttrs) => {
    return new ProductReview(attrs);
}

const ProductReview = mongoose.model<ProductReviewDoc, ProductReviewModel>('ProductReview', ProductReviewSchema);

export { ProductReview };