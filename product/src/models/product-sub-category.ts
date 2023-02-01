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
    productCategoryId:{type:mongoose.Schema.Types.ObjectId,ref:'ProductCategory'},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

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