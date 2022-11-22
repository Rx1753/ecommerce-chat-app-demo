import { body, check } from 'express-validator';

export class Validation {
  static signUpValidation = [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('Please provide a first name.'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Please provide a last name.'),
    body('type').trim().notEmpty().withMessage('Type can not be empty'),
    body('email').isEmail().withMessage('email must be valid -----'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('password must be between 4 and 20 characters ----'),
  ];

  static signInValidation = [
    body('email').isEmail().withMessage('Email Must Be Valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You Must supply a password'),
  ];
}
