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
    body('mrpPrice').isNumeric().notEmpty().withMessage('pls provide mrpPrice'),
    body('quantity').isNumeric().notEmpty().withMessage('pls provide quantity of the product'),
  ];
}
