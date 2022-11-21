import { body, oneOf } from 'express-validator';

export class CustomerAuthValidation {
    static SigninValidation =
        [
            body('name')
                .trim()
                .notEmpty()
                .withMessage('Please provide a name.'),
            body('password')
                .trim()
                .isLength({ min: 8, max: 20 })
                .withMessage('password must be between 4 and 20 characters'),
            body('email').isEmail().withMessage('email must be valid').optional(),
            body('phoneNumber')
                .trim()
                .isLength({ min: 10, max: 10 })
                .withMessage('phone number must be 10 digits').optional(),
            oneOf([body('email').notEmpty(),body('phoneNumber').notEmpty()],'One Of field is Require Email or PhoneNumber')
        ];
    static signInValidation = [
        body('email').isEmail().withMessage('email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 8, max: 20 })
            .withMessage('password must be between 4 and 20 characters'),
    ];

}