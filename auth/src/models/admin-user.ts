import mongoose, { ObjectId } from 'mongoose';
import { Password } from '../services/password';
import { AdminPermissionsDoc } from './admin-permissions';

// An interface that describe the properties
// that are required to create user
export interface AdminUserAttrs {
  userName: string;
  email?: string | null;
  password: string;
  phoneNumber?: number | null;
  createdBy?: string | null;
  permissionId?: {_id:string}[];
  allowChangePassword:boolean;
}

// An interface that describe the properties
// that user document has
interface AdminUserDoc extends mongoose.Document {
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
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
  permissionId: {_id:AdminPermissionsDoc}[];
  allowChangePassword:boolean;
}

// An interface that describe the properties
// that user model has
interface AdminUserModel extends mongoose.Model<AdminUserDoc> {
  build(attrs: AdminUserAttrs): AdminUserDoc;
}

// Schema
const adminUserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number },
    isMfa: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    imageUrl: { type: String, default: '' },
    isSuperAdmin: { type: Boolean, default: false },
    createdBy: { type: String, default: null, ref:'adminUser' },
    updatedBy: { type: String, default: '' },
    isActive: { type: Boolean, default: false },
    refreshToken: { type: String },
    allowChangePassword:{type:Boolean,default:true},
    permissionId: [{
      _id:
      {
        type: String,
        ref: 'adminPermissions',
      }
    }],
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

// This is middleware function
// that convert simple password into hash password on save method
// adminUserSchema.pre('save', async function (done) {
//   if (this.isModified('password')) {
//     const hased = await Password.toHash(this.get('password'));
//     this.set('password', hased);
//   }
//   done();
// });

// Adding statics property in schema
adminUserSchema.statics.build = (attrs: AdminUserAttrs) => {
  return new AdminUser(attrs);
};

// Model
const AdminUser = mongoose.model<AdminUserDoc, AdminUserModel>(
  'adminUser',
  adminUserSchema
);

export { AdminUser };
