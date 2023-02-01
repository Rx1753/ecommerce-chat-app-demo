import mongoose, { ObjectId } from "mongoose";
import { ProductCategoryDoc } from "./product-category";
import { ProductSubCategoryDoc } from "./product-sub-category";
import { StoreDoc } from "./store";

// intetface that describe the prooerties
// that are required to cretae new category
export interface ProductAttrs {
    name: string;
    description: string;
    productSubCategoryId: string;
    imageUrl: string;
    storeId: string;
    brandName: string;
    basePrice: number;
    mrpPrice: number;
    quantity: number;
    calculateOnBasePrice?: boolean;
    relatableProducts?: string[],
    createdBy: string,
}

// interface for categorymodel pass
interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

// interface for single category properties
export interface ProductDoc extends mongoose.Document {

    name: string;
    description: string;
    isActive: boolean;
    imageUrl: string;
    brandName: string;
    storeId: StoreDoc;
    basePrice: number;
    mrpPrice: number;
    quantity: number;
    calculateOnBasePrice: boolean;
    relatableProducts: ProductDoc[];
    createdBy: string;
    productSubCategoryId:ProductSubCategoryDoc;
}

const ProductSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    brandName: { type: String },
    basePrice: { type: Number },
    mrpPrice: { type: Number },
    quantity: { type: Number },
    productSubCategoryId:{type:mongoose.Schema.Types.ObjectId, ref:'ProductSubCategory'},
    calculateOnBasePrice: { type: Boolean, default: true },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    relatableProducts: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, );

ProductSchema.pre('save', async function (done) {
    done();
})
ProductSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

ProductSchema.statics.build = (attrs: ProductAttrs) => {
    return new Product(attrs);
}

const Product = mongoose.model<ProductDoc, ProductModel>('Product', ProductSchema);

export { Product };