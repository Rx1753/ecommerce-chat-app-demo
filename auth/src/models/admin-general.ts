import mongoose from 'mongoose';

interface AdminGeneralAttrs {
  name: string;
  status: boolean;
}

interface AdminGeneralDoc extends mongoose.Document {
  name: string;
  status: boolean;
}

interface AdminGeneralModel extends mongoose.Model<AdminGeneralDoc> {
  build(attrs: AdminGeneralAttrs): AdminGeneralDoc;
}

// Schema
const adminGeneralSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

// Adding statics property in schema
adminGeneralSchema.statics.build = (attrs: AdminGeneralAttrs) => {
  return new AdminGeneral(attrs);
};

// Model
const AdminGeneral = mongoose.model<AdminGeneralDoc, AdminGeneralModel>(
  'adminGeneral',
  adminGeneralSchema
);

export { AdminGeneral };
