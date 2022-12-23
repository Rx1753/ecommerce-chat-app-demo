import { body, oneOf } from 'express-validator';

export class BusinessProfileKYCValidation {
  static BusinessProfileKYCCreateValidation = [
    body('file').notEmpty().withMessage('Please provide a name.'),
    body('documentType').trim().notEmpty().withMessage('Please provide a documentType.'),
    body('businessProfileId').trim().notEmpty().withMessage('ples provide a businessProfileId')
  ];
}
