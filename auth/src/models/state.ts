import mongoose, { ObjectId } from "mongoose";
import { CountryCreatedPublisher } from "../events/publisher/country-publisher";
import { natsWrapper } from "../nats-wrapper";
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
    countryId: CountryDoc;
    isActive:boolean;
    created_at: Date;
    updated_at: Date;

}

const stateSchema = new mongoose.Schema({
    stateName: { type: String, required: true, unique: true },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'country' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
}, );

stateSchema.pre('save', async function (done) {
     await new CountryCreatedPublisher(natsWrapper.client).publish({
        id: (new mongoose.Types.ObjectId()).toHexString(),
        countryName: "poi"
    })
    done();
})

stateSchema.statics.build = (attrs: StateAttrs) => {
    return new State(attrs);
}

const State = mongoose.model<StateDoc, StateModel>('state', stateSchema);

export { State };