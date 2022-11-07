import mongoose from 'mongoose';
import { Password } from '../services/password';
import { v4 as uuidv4 } from 'uuid';

export const USER_TYPES = {
  CONSUMER: 'consumer',
  SUPPORT: 'support',
};

// An interface that describe the properties
// that are required to create user
interface UserAttrs {
  firstName: string;
  lastName: string;
  type: string;
  email: string;
  password: string;
}

// An interface that describe the properties
// that user document has
interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  type: string;
  email: string;
  password: string;
}

// An interface that describe the properties
// that user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Schema
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ''),
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    type: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
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
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hased = await Password.toHash(this.get('password'));
    this.set('password', hased);
  }
  done();
});

// Adding statics property in schema
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// Test
// User.build({email : "",password : ""});

export { User };
