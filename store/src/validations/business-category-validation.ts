import { body, oneOf } from 'express-validator';

export class BusinessCategoryValidation {
  static BusinessCategoryCreateValidation = [
    body('name').trim().notEmpty().withMessage('Please provide a name.'),
    body('description').trim().notEmpty().withMessage('Please provide a description.'),
    body('isActive').notEmpty().withMessage('pls provide status of the category')
  ];
}
