import mongoose, { ObjectId } from "mongoose";

// intetface that describe the prooerti
// that are required to cretae new user
export interface CountryAttrs {
    countryName: string;
}

// interface for usermodel pass
interface CountryModel extends mongoose.Model<CountryDoc> {
    build(attrs: CountryAttrs): CountryDoc;
}

// interface for single user properties
export interface CountryDoc extends mongoose.Document {
    countryName: string;
    created_at: Date;
    updated_at: Date;

}

const countrySchema = new mongoose.Schema({
    countryName: {type: String,required: true,unique: true},
    isDelete: { type: Boolean, default: false },
    created_at: { type: Number, default: () => Date.now() },
    updated_at: { type: Number, default: () => Date.now() },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.countryId = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.created_at;
            delete ret.updated_at;
        },

    }
});

countrySchema.pre('save', async function (done) {

})

countrySchema.statics.build = (attrs: CountryAttrs) => {
    return new Country(attrs);
}

const Country = mongoose.model<CountryDoc, CountryModel>('country', countrySchema);

export { Country };