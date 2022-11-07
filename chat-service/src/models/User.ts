import mongoose from 'mongoose';

interface UserAttrs {
  id: string;
  firstName: string;
  lastName: string;
  type: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): any;
  // createUser(
  //   firstName: string,
  //   lastName: string,
  //   type: string,
  //   email: string,
  //   password: string
  // ): any;
  getUserById(id: string): any;
  // getUsers(): any;
  // deleteByUserById(id: string): any;
  getUserByIds(ids: []): any;
}

interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  type: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String
    },
    firstName: String,
    lastName: String,
    type: String,
    email: String,
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

userSchema.statics.build = (attr: UserAttrs) => {
  return new User({
    _id: attr.id,
    firstName: attr.firstName,
    lastName: attr.lastName,
    type: attr.type,
    email: attr.email,
  });
};

// userSchema.statics.createUser = async function (
//   firstName,
//   lastName,
//   type,
//   email,
//   password
// ) {
//   try {
//     const user = await this.create({
//       firstName,
//       lastName,
//       type,
//       email,
//       password,
//     });
//     return user;
//   } catch (error) {
//     throw error;
//   }
// };

userSchema.statics.getUserById = async function (id) {
  try {
    const user = await this.findOne({ _id: id });
    if (!user) throw { error: 'No user with this id found' };
    return user;
  } catch (error) {
    throw error;
  }
};

// userSchema.statics.getUsers = async function () {
//   try {
//     const users = await this.find();
//     return users;
//   } catch (error) {
//     throw error;
//   }
// };

//Msgs
userSchema.statics.getUserByIds = async function (ids) {
  try {
    const users = await this.find({ _id: { $in: ids } });
    return users;
  } catch (error) {
    throw error;
  }
};

// userSchema.statics.deleteByUserById = async function (id) {
//   try {
//     const result = await this.remove({ _id: id });
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
export { User };
