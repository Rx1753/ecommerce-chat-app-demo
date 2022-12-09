// name, description, imageUrl, BusinessSubCategoryId, BusinessProfileId, email, phoneNumber, cityId, stateId, countryId, lat, lon, welcomeMessage, pinCode, addressLine1
import { body, oneOf } from 'express-validator';

export class StoreValidation {
  static StoreCreateValidation = [
    body('name').notEmpty().withMessage('Please provide name.'),
    body('description').notEmpty().withMessage('Please provide description'),
    body('imageUrl').notEmpty().withMessage('pls provide imageUrl'),
    body('BusinessSubCategoryId').notEmpty().withMessage('pls provide BusinessSubCategoryId'),
    body('BusinessProfileId').notEmpty().withMessage('pls provide BusinessProfileId'),
    body('email').isEmail().notEmpty().withMessage('pls provide email'),
    body('phoneNumber').trim().matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im).withMessage('phone number must be valid'),
    body('cityId').notEmpty().withMessage('pls provide cityId'),
    body('stateId').notEmpty().withMessage('pls provide stateId'),
    body('countryId').notEmpty().withMessage('pls provide countryId'),
    body('lat').notEmpty().withMessage('pls provide lat'),
    body('lon').notEmpty().withMessage('pls provide lon'),
    body('welcomeMessage').notEmpty().withMessage('pls provide welcomeMessage'),
    body('pinCode').notEmpty().withMessage('pls provide pinCode'),
    body('addressLine1').notEmpty().withMessage('pls provide addressLine1'),
  ];

  static StoreUpdateValidation=[
    body('name').notEmpty().withMessage('Please provide name.'),
    body('description').notEmpty().withMessage('Please provide description'),
    body('imageUrl').notEmpty().withMessage('pls provide imageUrl'),
    body('BusinessSubCategoryId').notEmpty().withMessage('pls provide BusinessSubCategoryId'),
    body('BusinessProfileId').notEmpty().withMessage('pls provide BusinessProfileId'),
    body('email').isEmail().notEmpty().withMessage('pls provide email'),
    body('phoneNumber').trim().matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im).withMessage('phone number must be valid'),
    body('cityId').notEmpty().withMessage('pls provide cityId'),
    body('stateId').notEmpty().withMessage('pls provide stateId'),
    body('countryId').notEmpty().withMessage('pls provide countryId'),
    body('lat').notEmpty().withMessage('pls provide lat'),
    body('lon').notEmpty().withMessage('pls provide lon'),
    body('welcomeMessage').notEmpty().withMessage('pls provide welcomeMessage'),
    body('pinCode').notEmpty().withMessage('pls provide pinCode'),
    body('addressLine1').notEmpty().withMessage('pls provide addressLine1'),
  ]
}
