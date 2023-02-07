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
    imageUrl: string[];
    storeId: string;
    brandName: string;
    warrenty?: boolean;
    highlights:string,
    guaranty?: boolean;
    basePrice: number;
    addOns?: boolean;
    quantity: number;
    isInvoiceAvailable?: boolean;
    isCancellation?: boolean;
    relatableProducts?: string[],
    createdBy:string,
    isDiscountPercentage:boolean,
    discount:number,
    discountedValue:number,
    maxDiscount:number,
}

// interface for categorymodel pass
interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

// interface for single category properties
export interface ProductDoc extends mongoose.Document {

    name: string;
    description: string;
    imageUrl: string[];
    basePrice: number;
    quantity:number;
    createdBy:string;
    rating:number;
    isDiscountPercentage:boolean,
    discount:number,
    discountedValue:number,
    maxDiscount:number,
    storeId:string
}

const ProductSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    highlights:{type:String},
    isActive: { type: Boolean, default: true },
    imageUrl: [{ type: String }],
    brandName: { type: String },
    warrenty: { type: Boolean, default: false },
    guaranty: { type: Boolean, default: false },
    basePrice: { type: Number },
    addOns: { type: Boolean, default: false },
    quantity: { type: Number },
    isInvoiceAvailable: { type: Boolean, default: false },
    isCancellation: { type: Boolean, default: false },
    storeId:{type:mongoose.Schema.Types.ObjectId,ref:'Store'},
    rating:{type:Number, default:4.9},
    relatableProducts: [
        {_id:false},
         { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    ],
    productSubCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductSubCategory' },
    isDiscountPercentage:{type:Boolean, require:true},
    discount:{type:Number},
    discountedValue:{type:Number,},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'BusinessUser'},
    maxDiscount:{type:Number},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
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