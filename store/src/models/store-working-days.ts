import mongoose, { ObjectId } from "mongoose";
import { StateDoc } from "./state";
import { StoreDoc } from "./store";

// intetface that describe the prooerti
// that are required to cretae new user
export interface storeWorkingDayAttrs {
    day: string;
    storeId: string;
    startTime:string;
    closeTime:string;
    startBreakTime:string;
    endBreakTime:string;
}

// interface for usermodel pass
interface storeWorkingDayModel extends mongoose.Model<storeWorkingDayDoc> {
    build(attrs: storeWorkingDayAttrs): storeWorkingDayDoc;
}

// interface for single user properties
export interface storeWorkingDayDoc extends mongoose.Document {
    day: string;
    startTime:string;
    closeTime:string;
    storeId: StoreDoc;
    startBreakTime:string;
    endBreakTime:string;
}

const storeWorkingDaySchema = new mongoose.Schema({
    day: { type: String,enum:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday' ] },
    storeId: { type: String, ref: 'store'},
    startTime:{type:String},
    closeTime:{type:String},
    startBreakTime:{type:String},
    endBreakTime:{type:String},
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.storeWorkingDayId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },

    }
});

storeWorkingDaySchema.pre('save', async function (done) {

})

storeWorkingDaySchema.statics.build = (attrs: storeWorkingDayAttrs) => {
    return new storeWorkingDay(attrs);
}

const storeWorkingDay = mongoose.model<storeWorkingDayDoc, storeWorkingDayModel>('storeWorkingDay', storeWorkingDaySchema);

export { storeWorkingDay };