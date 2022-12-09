import { body, oneOf } from 'express-validator';

export class ProductCategoryValidation {
  static ProductCategoryCreateValidation = [
    body('name').trim().notEmpty().withMessage('Please provide a name.'),
    body('description').trim().notEmpty().withMessage('Please provide a description.'),
    body('isActive').notEmpty().withMessage('pls provide status of the category'),
    body('businessSubCategoryId').notEmpty().withMessage('pls provide businessCategoryId')
  ];
}
