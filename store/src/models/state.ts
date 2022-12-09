import mongoose, { ObjectId } from "mongoose";
import { CountryDoc } from "./country";

// intetface that describe the prooerti
// that are required to cretae new user
export interface StateAttrs {
    stateName: string;
    countryId: string;
}

// interface for usermodel pass
interface StateModel extends mongoose.Model<StateDoc> {
    build(attrs: StateAttrs): StateDoc;
}

// interface for single user properties
export interface StateDoc extends mongoose.Document {
    stateName: string;
    country_id: CountryDoc;
    createdAt: Date;
    updatedAt: Date;

}

const stateSchema = new mongoose.Schema({
    stateName: { type: String, required: true, unique: true },
    countryId: { type: String, ref: 'country' },
    isDelete: { type: Boolean, default: false },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.stateId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },

    }
});

stateSchema.pre('save', async function (done) {

})

stateSchema.statics.build = (attrs: StateAttrs) => {
    return new State(attrs);
}

const State = mongoose.model<StateDoc, StateModel>('state', stateSchema);

export { State };