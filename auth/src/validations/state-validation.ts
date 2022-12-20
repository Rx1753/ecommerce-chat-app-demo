import { body, oneOf } from 'express-validator';

export class StateValidation {
  static StateCreateValidation = [
    body('stateName').trim().notEmpty().withMessage('Please provide a stateName.'),
    body('countryId').trim().notEmpty().withMessage('Please provide a countryId.'),
  ];
  static StateUpdateValidation = [
    body('stateName').trim().notEmpty().withMessage('Please provide a stateName.'),
    body('countryId').trim().notEmpty().withMessage('Please provide a countryId.'),
    body('isActive').isBoolean().withMessage("please provide status")
  ];
}
