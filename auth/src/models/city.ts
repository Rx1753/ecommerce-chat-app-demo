import mongoose, { ObjectId } from "mongoose";
import { StateDoc } from "./state";

// intetface that describe the prooerti
// that are required to cretae new user
export interface CityAttrs {
    cityName: string;
    stateId: string;
}

// interface for usermodel pass
interface CityModel extends mongoose.Model<CityDoc> {
    build(attrs: CityAttrs): CityDoc;
}

// interface for single user properties
export interface CityDoc extends mongoose.Document {
    cityName: string;
    stateId: StateDoc;
    isActive: boolean;
}

const citySchema = new mongoose.Schema({
    cityName: { type: String, required: true, unique: true},
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'state'},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
    isActive: { type: Boolean, default: true }
}, );

citySchema.pre('save', async function (done) {

})

citySchema.statics.build = (attrs: CityAttrs) => {
    return new City(attrs);
}

const City = mongoose.model<CityDoc, CityModel>('city', citySchema);

export { City };