import { body, oneOf } from 'express-validator';

export class StoreWorkingDayValidation {
  static StoreWorkingDayCreateValidation = [
    body('storeId').trim().notEmpty().withMessage('Please provide storeId.'),
    body('startTime').trim().notEmpty().withMessage('Please provide startTime'),
    body('closeTime').notEmpty().withMessage('pls provide closeTime'),
    body('startBreakTime').notEmpty().withMessage('pls provide startBreakTime at least with 00:00 value'),
    body('endBreakTime').notEmpty().withMessage('pls provide endBreakTime at least with 00:00 value'),
    body('day').notEmpty().withMessage('pls provide day')
  ];

  static StoreWorkingDayUpdateValidation=[
    body('startTime').trim().notEmpty().withMessage('Please provide startTime'),
    body('closeTime').notEmpty().withMessage('pls provide closeTime'),
    body('startBreakTime').notEmpty().withMessage('pls provide startBreakTime at least with 00:00 value'),
    body('endBreakTime').notEmpty().withMessage('pls provide endBreakTime at least with 00:00 value'),
  ]
}
