import mongoose, { ObjectId } from "mongoose";

export interface ProductVariantCombinationAttrs {
    name:string,
    type:string
}

interface ProductVariantCombinationModel extends mongoose.Model<ProductVariantCombinationDoc> {
    build(attrs: ProductVariantCombinationAttrs): ProductVariantCombinationDoc;
}

export interface ProductVariantCombinationDoc extends mongoose.Document {
    name:string,
    type:string
}

const ProductVariantCombinationSchema = new mongoose.Schema({
    productId: { type: String,ref:'Product' },
    price:{type:Number,},
    qty:{type:Number},
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
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

ProductVariantCombinationSchema.statics.build = (attrs: ProductVariantCombinationAttrs) => {
    return new ProductVariantCombination(attrs);
}

const ProductVariantCombination = mongoose.model<ProductVariantCombinationDoc, ProductVariantCombinationModel>('ProductVariantCombination', ProductVariantCombinationSchema);

export { ProductVariantCombination };