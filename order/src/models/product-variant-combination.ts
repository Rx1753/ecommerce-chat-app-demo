import mongoose, { ObjectId } from "mongoose";
import { AttributeDoc } from "./attribute";
import { AttributeValueDoc } from "./attribute-value";
import { SKUSDoc } from "./product-skus";

export interface ProductVariantCombinationAttrs {
    productSKUsId: string,
    attributeValueId: string,
    attributeId:string,
}

interface ProductVariantCombinationModel extends mongoose.Model<ProductVariantCombinationDoc> {
    build(attrs: ProductVariantCombinationAttrs): ProductVariantCombinationDoc;
}

export interface ProductVariantCombinationDoc extends mongoose.Document {
    productSKUsId: SKUSDoc,
    attributeValueId: AttributeValueDoc,
    attributeId:AttributeDoc,
}

const ProductVariantCombinationSchema = new mongoose.Schema({
    productSKUsId: { type: mongoose.Schema.Types.ObjectId,ref:'SKUS' },
    attributeId:{type:mongoose.Schema.Types.ObjectId,ref:'Attribute'},
    attributeValueId:{type:mongoose.Schema.Types.ObjectId,ref:'AttributeValue'},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
},);

ProductVariantCombinationSchema.pre('update', async function (done) {
    done();
})

ProductVariantCombinationSchema.statics.build = (attrs: ProductVariantCombinationAttrs) => {
    return new ProductVariantCombination(attrs);
}

const ProductVariantCombination = mongoose.model<ProductVariantCombinationDoc, ProductVariantCombinationModel>('ProductVariantCombination', ProductVariantCombinationSchema);

export { ProductVariantCombination };