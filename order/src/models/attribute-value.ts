import mongoose, { ObjectId } from "mongoose";
import { AttributeDoc } from "./attribute";

export interface AttributeValueAttrs {
    value: string,
    attributeId: string
}

interface AttributeValueModel extends mongoose.Model<AttributeValueDoc> {
    build(attrs: AttributeValueAttrs): AttributeValueDoc;
}

export interface AttributeValueDoc extends mongoose.Document {
    value: string,
    attributeId: AttributeDoc
}

const AttributeValueSchema = new mongoose.Schema({
    value: { type: String },
    attributeId: { type: mongoose.Schema.Types.ObjectId, ref:'Attribute' },
    isActive:{type:Boolean,default:true},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

AttributeValueSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

AttributeValueSchema.statics.build = (attrs: AttributeValueAttrs) => {
    return new AttributeValue(attrs);
}

const AttributeValue = mongoose.model<AttributeValueDoc, AttributeValueModel>('AttributeValue', AttributeValueSchema);

export { AttributeValue };