import { body, oneOf } from 'express-validator';

export class CouponValidation {
  static CouponCreateValidation = [
    body('name').trim().notEmpty().withMessage('Please provide a name.'),
    body('discountPercentage').trim().isNumeric().notEmpty().withMessage('Please provide a discountPercentage.'),
    body('repeatCoupon').isBoolean().withMessage('pls provide repeatCoupon'),
    body('maxUserLimit').isNumeric().notEmpty().withMessage('pls provide maxUserLimit'),
    body('maxDiscountAmount').isNumeric().notEmpty().withMessage('pls provide maxDiscountAmount'),
    body('createdFor').trim().notEmpty().withMessage('pls provide createdFor'),
    body('startDate').isDate().notEmpty().withMessage('pls provide startDate'),
    body('endDate').isDate().notEmpty().withMessage('pls provide endDate'),
    body('isMonthlyActive').isBoolean().notEmpty().withMessage('pls provide isMonthlyActive'),
    body('imageUrl').isArray().notEmpty().withMessage('pls provide imageUrl'),
  ];
}