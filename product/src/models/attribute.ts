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
    type:{type:String,enum:['text','image']},
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.AttributeId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },

    }
});

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