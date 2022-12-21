import mongoose, { ObjectId } from "mongoose";
import { BusinessSubCategoryDoc } from "./business-sub-category";
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
    warrenty?: boolean;
    guaranty?: boolean;
    basePrice: number;
    mrpPrice: number;
    addOns?: boolean;
    quantity: number;
    isInvoiceAvailable?: boolean;
    calculateOnBasePrice?: boolean;
    isCancellation?: boolean;
    relatableProducts?: string[],
    createdBy:string,
}

// interface for categorymodel pass
interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

// interface for single category properties
export interface ProductDoc extends mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string;
    isActive: boolean;
    productSubCategoryId: ProductSubCategoryDoc;
    imageUrl: string;
    brandName: string;
    storeId: StoreDoc;
    warrenty: boolean;
    guaranty: boolean;
    basePrice: number;
    mrpPrice: number;
    addOns: boolean;
    quantity: number;
    isInvoiceAvailable: boolean;
    calculateOnBasePrice: boolean;
    isCancellation: boolean;
    relatableProducts: ProductDoc[];
    createdBy:string;
}

const ProductSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    imageUrl: { type: String },
    brandName: { type: String },
    warrenty: { type: Boolean, default: false },
    guaranty: { type: Boolean, default: false },
    basePrice: { type: Number },
    mrpPrice: { type: Number },
    addOns: { type: Boolean, default: false },
    quantity: { type: Number },
    isInvoiceAvailable: { type: Boolean, default: false },
    calculateOnBasePrice: { type: Boolean, default: true },
    isCancellation: { type: Boolean, default: false },
    storeId:{type:String,ref:'Store'},
    relatableProducts: [
         { type: String, ref: 'Product' }
    ],
    productSubCategoryId: { type: String, ref: 'ProductSubCategory' },
    createdBy:{type:String,ref:'user'},
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.ProductId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },
    }
});

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