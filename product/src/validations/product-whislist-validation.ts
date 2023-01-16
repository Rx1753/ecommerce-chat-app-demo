import { body, oneOf } from 'express-validator';

export class ProductWhislistValidation {
  static ProductWhislistCreateValidation = [
    body('productId').trim().notEmpty().withMessage('Please provide productId.'),
  ];
}