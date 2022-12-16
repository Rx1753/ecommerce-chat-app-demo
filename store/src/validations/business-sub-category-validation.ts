import { body, oneOf } from 'express-validator';

export class BusinessSubCategoryValidation {
  static BusinessSubCategoryCreateValidation = [
    body('name').trim().notEmpty().withMessage('Please provide a name.'),
    body('description').trim().notEmpty().withMessage('Please provide a description.'),
    body('businessCategoryId').notEmpty().withMessage('pls provide businessCategoryId')
  ];

  static BusinessSubCategoryUpdateValidation = [
    body('name').trim().notEmpty().withMessage('Please provide a name.'),
    body('description').trim().notEmpty().withMessage('Please provide a description.'),
    body('isActive').isBoolean().withMessage('pls provide isActive status'),
    body('businessCategoryId').notEmpty().withMessage('pls provide businessCategoryID')
  ];
}
