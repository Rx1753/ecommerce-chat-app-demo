import { body, oneOf } from 'express-validator';

export class StoreHolidayValidation {
  static StoreHolidayCreateValidation = [
    body('storeId').notEmpty().withMessage('Please provide storeId.'),
    body('startDate').notEmpty().withMessage('Please provide startDate'),
    body('endDate').notEmpty().withMessage('pls provide endDate'),
  ];

  static StoreHolidayUpdateValidation=[
    body('startDate').notEmpty().withMessage('Please provide startDate'),
    body('endDate').notEmpty().withMessage('pls provide endDate'),
  ]
}
