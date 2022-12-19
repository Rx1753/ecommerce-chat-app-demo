import { body, oneOf } from 'express-validator';

export class BusinessCategoryValidation {
  static BusinessCategoryCreateValidation = [
    body('name').trim().notEmpty().withMessage('Please provide a name.'),
    body('description').trim().notEmpty().withMessage('Please provide a description.'),
  ];
  static BusinessCategoryUpdateValidation = [
    body('name').trim().notEmpty().withMessage('Please provide a name.'),
    body('isActive').isBoolean().withMessage('pls provide isActive status'),
    body('description').trim().notEmpty().withMessage('Please provide a description.'),
  ];
}
