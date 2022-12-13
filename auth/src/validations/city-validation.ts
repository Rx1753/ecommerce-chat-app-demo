import { body, oneOf } from 'express-validator';

export class CityValidation {
  static CityCreateValidation = [
    body('cityName').trim().notEmpty().withMessage('Please provide a cityName.'),
    body('stateId').trim().notEmpty().withMessage('Please provide a countryId.'),
  ];
}
