import mongoose from 'mongoose';

// An interface that describe the properties
// that are required to create adminSwitches
interface adminSwitchesAttrs {
  name:string;
  status:boolean;
}

// An interface that describe the properties
// that adminSwitches document has
interface adminSwitchesDoc extends mongoose.Document {
    name:string;
    status:boolean;
}

// An interface that describe the properties
// that adminSwitches model has
interface adminSwitchesModel extends mongoose.Model<adminSwitchesDoc> {
  build(attrs: adminSwitchesAttrs): adminSwitchesDoc;
}

// Schema
const adminSwitchesSchema = new mongoose.Schema(
  {
   name:{type:String},
   status:{type:Boolean},
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
adminSwitchesSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updated_at', updated_at);
    done();
})

// Adding statics property in schema
adminSwitchesSchema.statics.build = (attrs: adminSwitchesAttrs) => {
  return new adminSwitches(attrs);
};

// Model
const adminSwitches = mongoose.model<adminSwitchesDoc, adminSwitchesModel>('adminSwitches', adminSwitchesSchema);


export { adminSwitches };
