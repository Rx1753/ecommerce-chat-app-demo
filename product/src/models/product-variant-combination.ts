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
    productSKUsId: { type: String,ref:'SKUS' },
    attributeId:{type:String,ref:'Attribute'},
    attributeValueId:{type:String,ref:'AttributeValue'},
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.ProductVariantCombinationId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },

    }
});

ProductVariantCombinationSchema.pre('update', async function (done) {
    done();
})

ProductVariantCombinationSchema.statics.build = (attrs: ProductVariantCombinationAttrs) => {
    return new ProductVariantCombination(attrs);
}

const ProductVariantCombination = mongoose.model<ProductVariantCombinationDoc, ProductVariantCombinationModel>('ProductVariantCombination', ProductVariantCombinationSchema);

export { ProductVariantCombination };