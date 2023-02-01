import mongoose, { ObjectId } from 'mongoose';
import { CityDoc } from './city';
import { CountryDoc } from './country';
import { StateDoc } from './state';

// An interface that describe the properties
// that are required to create customerAddress
interface customerAddressAttrs {
  customerId: string;
  phoneNumber: number;
  addressType: string;
  isDefalultAddress: boolean;
  addressLine1: string;
  addressLine2: string;
  cityId: string;
  stateId: string;
  countryId: string;
  zipCode: number;
}

// An interface that describe the properties
// that customerAddress document has
interface customerAddressDoc extends mongoose.Document {
  customerId: string;
  phoneNumber: number;
  addressType: string;
  isDefalultAddress: boolean;
  addressLine1: string;
  addressLine2: string;
  cityId: CityDoc;
  stateId: StateDoc;
  countryId: CountryDoc;
  zipCode:number;
}

// An interface that describe the properties
// that customerAddress model has
interface customerAddressModel extends mongoose.Model<customerAddressDoc> {
  build(attrs: customerAddressAttrs): customerAddressDoc;
}

// Schema
const customerAddressSchema = new mongoose.Schema(
  {
    customerId: { type: String,required:true },
    phoneNumber: { type: Number },
    addressType: { type: String },
    isDefalultAddress: { type: Boolean },
    addressLine1: { type: String },
    addressLine2: { type: String },
    cityId: { type: mongoose.Schema.Types.ObjectId ,ref:'city' },
    stateId: { type: mongoose.Schema.Types.ObjectId , ref:'state'},
    countryId: { type: mongoose.Schema.Types.ObjectId , ref:'country'},
    zipCode: {type:Number},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
  },
  
);

// This is middleware function
customerAddressSchema.pre('update', async function (done) {
  const currentDate = new Date();
  const updated_at = currentDate.getTime();
  this.set('updated_at', updated_at);
  done();
})

// Adding statics property in schema
customerAddressSchema.statics.build = (attrs: customerAddressAttrs) => {
  return new customerAddress(attrs);
};

// Model
const customerAddress = mongoose.model<customerAddressDoc, customerAddressModel>('customerAddress', customerAddressSchema);


export { customerAddress };
