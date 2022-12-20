import { body, oneOf } from 'express-validator';

export class CountryValidation {
  static CountryCreateValidation = [
    body('countryName').trim().notEmpty().withMessage('Please provide a countryName.'),
  ];
  static CountryUpdateValidation = [
    body('countryName').trim().notEmpty().withMessage('Please provide a countryName.'),
    body('isActive').isBoolean().withMessage("please provide status")
  ];
}
