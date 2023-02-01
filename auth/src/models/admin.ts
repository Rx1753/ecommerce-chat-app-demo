import mongoose, { ObjectId } from 'mongoose';
import { AdminRoleDoc } from './admin-role';

// An interface that describe the properties
// that are required to create user
export interface AdminAttrs {
  userName: string;
  email?: string | null;
  password: string;
  phoneNumber?: number | null;
  createdBy?: string | null;
  allowChangePassword: boolean;
  roleId: string,
}

// An interface that describe the properties
// that user document has
interface AdminDoc extends mongoose.Document {
  userName: string;
  email: string;
  password: string;
  phoneNumber: number;
  isMfa: boolean;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  imageUrl: string;
  isSuperAdmin: boolean;
  //permissionId :
  roleId: AdminRoleDoc;
  createdBy: AdminDoc;
  updatedBy: string;
  isActive: boolean;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
  allowChangePassword: boolean;
}

// An interface that describe the properties
// that user model has
interface AdminModel extends mongoose.Model<AdminDoc> {
  build(attrs: AdminAttrs): AdminDoc;
}

// Schema
const AdminSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, },
    password: { type: String, required: true },
    phoneNumber: { type: Number },
    isMfa: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    imageUrl: { type: String, default: '' },
    isSuperAdmin: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'admin' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, default: '' },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String },
    allowChangePassword: { type: Boolean, default: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminRole', required: true },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() }  },
 
);

// This is middleware function
// that convert simple password into hash password on save method
// AdminSchema.pre('save', async function (done) {
//   if (this.isModified('password')) {
//     const hased = await Password.toHash(this.get('password'));
//     this.set('password', hased);
//   }
//   done();
// });

// Adding statics property in schema
AdminSchema.statics.build = (attrs: AdminAttrs) => {
  return new Admin(attrs);
};

// Model
const Admin = mongoose.model<AdminDoc, AdminModel>(
  'admin',
  AdminSchema
);

export { Admin };
