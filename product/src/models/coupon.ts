import mongoose, { ObjectId } from "mongoose";

// intetface that describe the prooerties
// that are required to cretae new category
export interface CouponAttrs {
  name: string;
  discountPercentage: number;
  couponCode: string;
  description:string;
  isRepeatCoupon: boolean;
  maxUserLimit: number;
  maxDiscountAmount: number;
  createdFor: string;
  startDate: Date;
  endDate: Date;
  minOrderAmount:number;
  isMonthlyActive: boolean;
  couponAuthor: string;
  imageUrl: string;
  isActive: boolean;
}
// interface for categorymodel pass
export interface CouponModel extends mongoose.Model<CouponDoc> {
  build(attrs: CouponAttrs): CouponDoc;
}
// interface for single category properties
export interface CouponDoc extends mongoose.Document {
  name: string;
  discountPercentage: number;
  description:string;
  couponCode: string;
  isRepeatCoupon: boolean;
  maxUserLimit: number;
  maxDiscountAmount: number;
  createdFor: string;
  startDate: Date;
  endDate: Date;
  minOrderAmount:number;
  isMonthlyActive: boolean;
  couponAuthor: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}
export const CouponSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    description:{type:String,required:true},
    discountPercentage: { type: Number, required: true },
    couponCode: { type: String, unique: true, required: true },
    isRepeatCoupon: { type: Boolean, default: false },
    maxUserLimit: { type: Number },
    maxDiscountAmount: { type: Number },
    createdFor: {
      type: String,
      enum: [
        "isGeneral",
        "store",
        "product",
        "customer",
        "productCategory",
        "productSubCategory",
      ],
      required: true,
    },
    minOrderAmount:{type:Number,default:0},
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isMonthlyActive: { type: Boolean, default: false },
    couponAuthor: { type: String, enum: ["Admin", "Vendor"], required: true },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
  }
);
CouponSchema.pre("save", async function (done) {
  done();
});
CouponSchema.pre("update", async function (done) {
  const currentDate = new Date();
  const updatedAt = currentDate.getTime();
  this.set("updatedAt", updatedAt);
  done();
});
CouponSchema.statics.build = (attrs: CouponAttrs) => {
  return new Coupon(attrs);
};
const Coupon = mongoose.model<CouponDoc, CouponModel>('Coupon', CouponSchema);
export { Coupon };