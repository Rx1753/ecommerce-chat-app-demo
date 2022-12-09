import mongoose, { ObjectId } from "mongoose";
import { ProductCategoryDoc } from "./product-category";

// intetface that describe the prooerties
// that are required to cretae new category

export interface ProductSubCategoryAttrs {
    name:string,
    description:string,
    isActive:boolean,
    productCategoryId:string
}

// interface for categorymodel pass
interface ProductSubCategoryModel extends mongoose.Model<ProductSubCategoryDoc> {
    build(attrs: ProductSubCategoryAttrs): ProductSubCategoryDoc;
}

// interface for single category properties
export interface ProductSubCategoryDoc extends mongoose.Document {
    
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description:string;
    isActive:boolean;
    productCategoryId:ProductCategoryDoc;
}

const ProductSubCategorySchema = new mongoose.Schema({
    name: { type: String },
    description: {type: String},
    isActive: { type: Boolean, default: true },
    productCategoryId:{type:String,ref:'ProductCategory'},
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.ProductSubCategoryId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.isActive;
            delete ret.createdAt;
            delete ret.updatedAt;
        },

    }
});

ProductSubCategorySchema.pre('save', async function (done) {
    done();
})
ProductSubCategorySchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

ProductSubCategorySchema.statics.build = (attrs: ProductSubCategoryAttrs) => {
    return new ProductSubCategory(attrs);
}

const ProductSubCategory = mongoose.model<ProductSubCategoryDoc, ProductSubCategoryModel>('ProductSubCategory', ProductSubCategorySchema);

export { ProductSubCategory };