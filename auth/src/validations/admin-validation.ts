import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { body, check } from 'express-validator';

export class Validation {
  static signUpValidation = [
    body('userName')
      .trim()
      .notEmpty()
      .withMessage('Please provide a user name.'),
    body('email').isEmail().withMessage('email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('password must be between 8 and 20 characters'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new BadRequestError(
          'Password confirmation does not match password'
        );
      }
      return true;
    }),
    body('permissionId').trim().notEmpty().withMessage('Select permission'),
  ];

  static signInValidation = [
    body('email').isEmail().withMessage('Email Must Be Valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ];

  static updateProfileValidation = [
    body('userId').trim().notEmpty().withMessage('User Id is required'),
    body('userName')
      .trim()
      .notEmpty()
      .withMessage('User name must not be empty'),
  ];

  static mfaValidation = [
    body('userId').trim().notEmpty().withMessage('User Id is required'),
    // body('isMfa')
    //   .exists()
    //   .withMessage('isMfa is required')
    //   .isBoolean()
    //   .withMessage('isMfa must be boolean')
    //   .custom((value, { req }) => {
    //     if (value !== true) {
    //       throw new BadRequestError('Mfa is not true');
    //     }
    //     return true;
    //   }),
    body('type')
      .exists()
      .withMessage('type is required')
      .isString()
      .withMessage('type must be string')
      .isIn(['email', 'phoneNumber'])
      .withMessage('invalid value for type'),
    body('value').trim().notEmpty().withMessage('Value must not be empty'),
  ];

  static verifyEmail = [
    body('userId').trim().notEmpty().withMessage('user Id is required'),
    body('code').trim().notEmpty().withMessage('code is required'),
    body('type')
      .exists()
      .withMessage('type is required')
      .isString()
      .withMessage('type must be string')
      .isIn(['email'])
      .withMessage('require email type'),
  ];

  static verifyPhone = [
    body('userId').trim().notEmpty().withMessage('user Id is required'),
    body('code').trim().notEmpty().withMessage('code is required'),
    body('type')
      .exists()
      .withMessage('type is required')
      .isString()
      .withMessage('type must be string')
      .isIn(['phoneNumber'])
      .withMessage('require phoneNumber type'),
  ];
}
