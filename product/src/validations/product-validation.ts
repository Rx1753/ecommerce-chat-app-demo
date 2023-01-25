import { body, oneOf } from 'express-validator';

export class ProductValidation {
  static ProductCreateValidation = [
    body('name').trim().notEmpty().withMessage('Please provide a name.'),
    body('description').trim().notEmpty().withMessage('Please provide a description.'),
    body('productSubCategoryId').notEmpty().withMessage('pls provide productSubCategoryd'),
    body('imageUrl').isArray().withMessage('pls provide at least one image'),
    body('storeId').notEmpty().withMessage('pls provide storeId'),
    body('brandName').notEmpty().withMessage('pls provide brandName'),
    body('basePrice').isNumeric().notEmpty().withMessage('pls provide basePrice'),
    body('quantity').isNumeric().notEmpty().withMessage('pls provide quantity of the product'),
    body('isDiscountPercentage').isBoolean().notEmpty().withMessage('pls provide isDiscountPercentage'),
    body('discount').isNumeric().notEmpty().withMessage('pls provide discount amount'),
    body('maxDiscount').isNumeric().notEmpty().withMessage('pls provide maximum discount value'),
    body('highlights').notEmpty().withMessage('pls provide product highlights'),
  ];
  static ProductVariantValidation =[
    body('productId').notEmpty().withMessage('pls provide productId'),
    body('attribute').isArray().notEmpty().withMessage('pls provide attribute'),
    body('qty').notEmpty().withMessage('pls provide qty'),
    body('name').notEmpty().withMessage('pls provide name'),
    body('price').notEmpty().withMessage('pls provide price'),
    body('isVariantBasedPrice').notEmpty().withMessage('pls provide isVariantBasedPrice'),
    body('isVariantHasImage').notEmpty().withMessage('pls provide isVariantHasImage'),
    body('imageUrl').notEmpty().withMessage('pls provide imageUrl'),
  ]
}
