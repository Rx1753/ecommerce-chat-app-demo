import mongoose, { ObjectId } from "mongoose";

export interface AttributeAttrs {
    name:string,
    type:string,
}

interface AttributeModel extends mongoose.Model<AttributeDoc> {
    build(attrs: AttributeAttrs): AttributeDoc;
}

export interface AttributeDoc extends mongoose.Document {
    name:string,
    type:string,
}

const AttributeSchema = new mongoose.Schema({
    name: { type: String },
    type:{type:String,enum:['text','image','number']},
    isActive:{type:Boolean,default:true},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, 
);

AttributeSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

AttributeSchema.statics.build = (attrs: AttributeAttrs) => {
    return new Attribute(attrs);
}

const Attribute = mongoose.model<AttributeDoc, AttributeModel>('Attribute', AttributeSchema);

export { Attribute };