import { BadRequestError } from '@rx-ecommerce-chat/common_lib';
import { body, check, oneOf } from 'express-validator';

export class Validation {
  // static signUpValidation = [
  //   body('userName')
  //     .trim()
  //     .notEmpty()
  //     .withMessage('Please provide a user name.'),
  //   body('email').isEmail().withMessage('email must be valid'),
  //   body('password')
  //     .trim()
  //     .isLength({ min: 8, max: 20 })
  //     .withMessage('password must be between 8 and 20 characters'),
  //   body('confirmPassword').custom((value, { req }) => {
  //     if (value !== req.body.password) {
  //       throw new BadRequestError(
  //         'Password confirmation does not match password'
  //       );
  //     }
  //     return true;
  //   }),
  //   body('permissionId').trim().notEmpty().withMessage('Select permission'),

  // ];

  // static signInValidation = [
  //   body('email').isEmail().withMessage('Email Must Be Valid'),
  //   body('password')
  //     .trim()
  //     .notEmpty()
  //     .withMessage('You must supply a password'),
  // ];


  static addAdminValidation = [
    body('userName').trim().notEmpty().withMessage('Please provide a name.'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),
    body('email').isEmail().withMessage('email must be valid').optional(),
    body('phoneNumber')
      .trim()
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .withMessage('phone number must be valid')
      .optional(),

    oneOf(
      [body('email').notEmpty(), body('phoneNumber').notEmpty()],
      'One Of field is Require Email or PhoneNumber'
    ),
  ];
  static signInValidation = [
    body('email').isEmail().withMessage('email must be valid').optional(),
    body('phoneNumber')
      .trim()
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .withMessage('phone number must be valid')
      .optional(),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),
    oneOf(
      [body('email').notEmpty(), body('phoneNumber').notEmpty()],
      'One Of field is Require Email or PhoneNumber'
    ),
  ];
  static forgotPasswordValidation = [
    body('email').isEmail().withMessage('email must be valid')
  ];
  static forgotCodeValidation = [
    body('code').notEmpty().withMessage('Code must be write'),
    body('password').notEmpty().withMessage('password must be write')
  ];
  static updatesRoleIdValidation=[
    body('id').notEmpty().withMessage('pls provide id'),
    body('tableName').notEmpty().withMessage('pls provide tableName'),
    body('isRead').isBoolean().withMessage('pls write isRead'),
    body('isUpdate').isBoolean().withMessage('pls write isUpdate'),
    body('isDelete').isBoolean().withMessage('pls write isDelete'),
    body('isCreate').isBoolean().withMessage('pls write isCreate'),
  ]
  static updateRoleValidation=[
    body('id').notEmpty().withMessage('pls provide id of admin you want to update'),
    body('roleId').notEmpty().withMessage('pls write RoleId of the admin'),
  ]

  static addRoleValidation=[
    body('tableName').notEmpty().withMessage('pls provide tableName'),
    body('isRead').isBoolean().withMessage('pls write isRead'),
    body('isUpdate').isBoolean().withMessage('pls write isUpdate'),
    body('isDelete').isBoolean().withMessage('pls write isDelete'),
    body('isCreate').isBoolean().withMessage('pls write isCreate'),
  ]
  
}
