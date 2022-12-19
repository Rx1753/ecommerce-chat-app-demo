import { body, oneOf } from 'express-validator';

export class ProductCategoryValidation {
  static ProductCategoryCreateValidation = [
    body('name').trim().notEmpty().withMessage('Please provide a name.'),
    body('description').trim().notEmpty().withMessage('Please provide a description.'),
    body('businessSubCategoryId').notEmpty().withMessage('pls provide businessSubCategoryId')
  ];
  static ProductCategoryUpdateValidation = [
    body('name').trim().notEmpty().withMessage('Please provide a name.'),
    body('description').trim().notEmpty().withMessage('Please provide a description.'),
    body('isActive').isBoolean().withMessage('pls provide isActive status'),
    body('businessSubCategoryId').notEmpty().withMessage('pls provide businessSubCategoryID')
  ];
}
