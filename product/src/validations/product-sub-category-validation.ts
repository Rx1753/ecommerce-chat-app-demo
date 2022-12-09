import { body, oneOf } from 'express-validator';

export class ProductSubCategoryValidation {
  static ProductSubCategoryCreateValidation = [
    body('name').trim().notEmpty().withMessage('Please provide a name.'),
    body('description').trim().notEmpty().withMessage('Please provide a description.'),
    body('isActive').notEmpty().withMessage('pls provide status of the category'),
    body('productCategoryId').notEmpty().withMessage('pls provide businessCategoryId')
  ];
}
