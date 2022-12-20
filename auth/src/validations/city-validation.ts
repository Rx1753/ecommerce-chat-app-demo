import { body, oneOf } from 'express-validator';

export class CityValidation {
  static CityCreateValidation = [
    body('cityName').trim().notEmpty().withMessage('Please provide a cityName.'),
    body('stateId').trim().notEmpty().withMessage('Please provide a countryId.'),
  ];
  static CityUpdateValidation = [
    body('cityName').trim().notEmpty().withMessage('Please provide a cityName.'),
    body('stateId').trim().notEmpty().withMessage('Please provide a countryId.'),
    body('isActive').isBoolean().withMessage("please provide status")
  ];
}
