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
}

const citySchema = new mongoose.Schema({
    cityName: { type: String, required: true, unique: true},
    stateId: { type: String, ref: 'state'},
    created_at: { type: Number, default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) },
    updated_at: { type: Number, default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) },
    is_delete: { type: Boolean, default: false }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.cityId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.created_at;
            delete ret.updated_at;
        },

    }
});

citySchema.pre('save', async function (done) {

})

citySchema.statics.build = (attrs: CityAttrs) => {
    return new City(attrs);
}

const City = mongoose.model<CityDoc, CityModel>('city', citySchema);

export { City };