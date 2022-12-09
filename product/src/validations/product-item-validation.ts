import { body, oneOf } from 'express-validator';

export class ProductItemValidation {
  static ProductItemCreateValidation = [
    body('name').trim().notEmpty().withMessage('Please provide a name.'),
    body('description').trim().notEmpty().withMessage('Please provide a description.'),
    body('productId').notEmpty().withMessage('pls provide productSubCategoryd'),
    body('imageUrl').notEmpty().withMessage('pls provide at least one image'),
    body('storeId').notEmpty().withMessage('pls provide storeId'),
    body('mrpPrice').isNumeric().notEmpty().withMessage('pls provide mrpPrice'),
    body('quantity').isNumeric().notEmpty().withMessage('pls provide quantity of the product'),
  ];
}
