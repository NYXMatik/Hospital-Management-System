import { Router } from 'express';
import { celebrate, Joi, errors } from 'celebrate';
import { Container } from 'typedi';
import config from "../../../config";
import IMedicalRecordAllergyController from '../../controllers/IControllers/IMedicalRecordAllergyController';

const route = Router();

export default (app: Router) => {
  app.use('/medical-records', route);

  const ctrl = Container.get(config.controllers.medicalRecordAllergy.name) as IMedicalRecordAllergyController;
  const allergyCodePattern = /^[A-Za-z0-9]+(?:[- ][A-Za-z0-9]+)*:\s*[A-Za-z0-9]+(?:[-.][A-Za-z0-9]+)*$/;
  const allergyCodeMessage = 'Code must be in format "SYSTEM: CODE" (e.g., "ICD-11: RA12.0" or "SNOMED CT: 309210001") or a simple alphanumeric code with dots/hyphens';


  const logRequestDetails = (req, res, next) => {
    console.log('Received request:', {
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      body: req.body
    });
    next();
  };


  // Add allergies to medical record
  // /medical-records/allergies?userId=userId
  // Search allergy in medical record
  // /medical-records/allergies?userId=userId&code=code
  // Delete allergy from medical record
  // /medical-records/allergies?userId=userId&code=code
  // Update an allergies in medical record
  // /medical-records/allergies?userId=userId

  
  // Search for medical records by allergy
  // /medical-records/allergies?code=code



  // Update allergies in medical record
  // /medical-records/allergies?userId=userId
  route.patch('/allergies',
    logRequestDetails,
    celebrate({
      query: Joi.object({
        userId: Joi.string()
          .required()
          .custom((value, helpers) => {
            try {
              return decodeURIComponent(value);
            } catch (e) {
              return helpers.error('any.invalid');
            }
          })
          .messages({
            'any.required': 'User ID is required',
            'string.empty': 'User ID cannot be empty'
          })
      }),
      body: Joi.object({
        allergies: Joi.array()
          .items(
            Joi.string()
              .regex(allergyCodePattern)
              .required()
              .messages({
                'string.pattern.base': allergyCodeMessage,
                'string.empty': 'Allergy code cannot be empty',
                'any.required': 'Allergy code is required'
              })
          )
          .min(1)
          .required()
          .messages({
            'array.min': 'At least one allergy code must be provided',
            'any.required': 'Allergies array is required'
          })
      })
    }),
    (req, res, next) => ctrl.updateAllergies(req, res, next)
  );

  // Search medical record for an allergy
  // /medical-records/allergies?userId=userId&code=code
  route.get('/allergies',
    celebrate({
      query: Joi.object({
        userId: Joi.string()
          .required()
          .messages({
            'any.required': 'User ID is required',
            'string.empty': 'User ID cannot be empty'
          }),
        code: Joi.string()
          .regex(/^[A-Za-z0-9]+(?:[- ][A-Za-z0-9]+)*:\s*[A-Za-z0-9]+(?:[-.][A-Za-z0-9]+)*$/)
          .required()
          .messages({
            'string.pattern.base': 'Code must only contain alphanumeric characters and the special characters: -, _, ., :',
            'any.required': 'Allergy code is required',
            'string.empty': 'Allergy code cannot be empty'
        })
      })
    }),
    (req, res, next) => ctrl.searchMedicalRecordsByAllergyAndUser(req, res, next)
  );

  // Delete entry for an allergy in a medical record
  // /medical-records/allergies?userId=userId&code=code
  route.delete('/allergies',
    celebrate({
      query: Joi.object({
        userId: Joi.string()
          .required()
          .messages({
            'any.required': 'User ID is required',
            'string.empty': 'User ID cannot be empty'
          }),
        code: Joi.string()
          .regex(/^[A-Za-z0-9]+(?:[- ][A-Za-z0-9]+)*:\s*[A-Za-z0-9]+(?:[-.][A-Za-z0-9]+)*$/)
          .required()
          .messages({
            'string.pattern.base': 'Code must only contain alphanumeric characters and the special characters: -, _, ., :',
            'any.required': 'Allergy code is required',
            'string.empty': 'Allergy code cannot be empty'
          })
      })
    }),
    (req, res, next) => ctrl.deleteAllergyFromMedicalRecords(req, res, next)
  );

  // Update an allergy in a medical record
  // /medical-records/allergies?userId=userId
  route.put('/allergies',
    logRequestDetails,
    celebrate({
      query: Joi.object({
        userId: Joi.string()
          .required()
          .messages({
            'any.required': 'User ID is required',
            'string.empty': 'User ID cannot be empty'
          })
      }),
      body: Joi.object({
        Code: Joi.string()
          .regex(/^[A-Za-z0-9]+(?:[- ][A-Za-z0-9]+)*:\s*[A-Za-z0-9]+(?:[-.][A-Za-z0-9]+)*$/)
          .required()
          .messages({
            'string.pattern.base': 'Code must only contain alphanumeric characters and the special characters: -, _, ., :',
            'string.empty': 'Code cannot be empty',
            'any.required': 'Code is required'
          }),
        Designation: Joi.string()
          .regex(/^(?=.*[A-Za-z])[A-Za-z0-9\s\-\(\)]+$/)
          .required()
          .messages({
            'string.pattern.base': 'Designation must contain at least one letter and can include letters, numbers, spaces, apostrophes, and commas',
            'string.empty': 'Designation cannot be empty',
            'any.required': 'Designation is required'
          }),
        Description: Joi.string()
          .required()
          .min(3)
          .max(500)
          .messages({
            'string.empty': 'Description cannot be empty',
            'string.min': 'Description must be at least 3 characters long',
            'string.max': 'Description cannot exceed 500 characters',
            'any.required': 'Description is required'
          })
      }).required()
    }),
    (req, res, next) => ctrl.updateAllergyInMedicalRecords(req, res, next)
  );


  app.use(errors());
};
