import { body, oneOf } from 'express-validator';

export class CartValidation {
  static CartCreateValidation = [
    body('productId').notEmpty().withMessage('pls provide productId'),
    body('productIteamId').notEmpty().optional({ nullable: true }),
    body('purchaseQuantity').isNumeric().notEmpty().withMessage('pls provide quantity of the product'),
  ];
}
