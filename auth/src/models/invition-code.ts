import mongoose from 'mongoose';

// An interface that describe the properties
// that are required to create invitionCode
interface invitionCodeAttrs {
    type: string;
    phoneNumber?: Number;
    email?: string;
    userId?:string;
    code: String;
    expirationDays?: Number;
}

// An interface that describe the properties
// that invitionCode document has
interface invitionCodeDoc extends mongoose.Document {
    type: string;
    phoneNumber: Number;
    email: string;
    userId:string;
    code: String;
    created_By:string;
    created_at: Number;
    updated_at: Number;
    expirationDays: Number;
}

// An interface that describe the properties
// that invitionCode model has
interface invitionCodeModel extends mongoose.Model<invitionCodeDoc> {
    build(attrs: invitionCodeAttrs): invitionCodeDoc;
}

// Schema
const invitionCodeSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ['customer','business','admin','email','phoneNumber']},
        userId: {type: String },
        phoneNumber: { type: Number },
        email:{type:String},
        code: { type: String },
        isUsed:{type:Boolean,defaul:false},
        expirationDays: { type: Number, default: 10 },
        created_By:{type:String},
        created_at: { type: Number, default: () => Date.now() },
        updated_at: { type: Number, default: () => Date.now() },
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

// This is middleware function
invitionCodeSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updated_at', updated_at);
    done();
})

// Adding statics property in schema
invitionCodeSchema.statics.build = (attrs: invitionCodeAttrs) => {
    return new invitionCode(attrs);
};

// Model
const invitionCode = mongoose.model<invitionCodeDoc, invitionCodeModel>('invitionCode', invitionCodeSchema);


export { invitionCode };
