import { Router } from 'express';
import { celebrate, Joi, errors } from 'celebrate';
import { Container } from 'typedi';
import config from "../../../config";
import IMedicalRecordFreeTextController from '../../controllers/IControllers/IMedicalRecordFreeTextController';

const route = Router();

export default (app: Router) => {
  app.use('/medical-records', route);

  const ctrl = Container.get(config.controllers.medicalRecordFreeText.name) as IMedicalRecordFreeTextController;

  const logRequestDetails = (req, res, next) => {
    console.log('Received request:', {
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      body: req.body
    });
    next();
  };

  // Add freetext to medical record
  // /medical-records/freetext?userId=userId
  route.post('/freetext',
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
        text: Joi.string()
          .required()
          .min(3)
          .max(500)
          .messages({
            'string.empty': 'Text cannot be empty',
            'string.min': 'Text must be at least 3 characters long',
            'string.max': 'Text cannot exceed 500 characters',
            'any.required': 'Text is required'
          })
      }).required()
    }),
    (req, res, next) => ctrl.addFreeTextToMedicalRecords(req, res, next)
  );

  // Update freetext in medical record
  // /medical-records/freetext?userId=userId
  route.put('/freetext',
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
        text: Joi.string()
          .required()
          .min(3)
          .max(500)
          .messages({
            'string.empty': 'Text cannot be empty',
            'string.min': 'Text must be at least 3 characters long',
            'string.max': 'Text cannot exceed 500 characters',
            'any.required': 'Text is required'
          })
      }).required()
    }),
    (req, res, next) => ctrl.updateFreeTextInMedicalRecords(req, res, next)
  );

  // Search medical record for freetext
  // /medical-records/freetext?userId=userId&text=text
  route.get('/freetext',
    celebrate({
      query: Joi.object({
        userId: Joi.string()
          .required()
          .messages({
            'any.required': 'User ID is required',
            'string.empty': 'User ID cannot be empty'
          }),
        text: Joi.string()
          .required()
          .min(3)
          .max(500)
          .messages({
            'string.empty': 'Text cannot be empty',
            'string.min': 'Text must be at least 3 characters long',
            'string.max': 'Text cannot exceed 500 characters',
            'any.required': 'Text is required'
          })
      })
    }),
    (req, res, next) => ctrl.searchMedicalRecordsByFreeTextAndUser(req, res, next)
  );

  // Delete freetext from medical record
  // /medical-records/freetext?userId=userId&text=text
  route.delete('/freetext',
    celebrate({
      query: Joi.object({
        userId: Joi.string()
          .required()
          .messages({
            'any.required': 'User ID is required',
            'string.empty': 'User ID cannot be empty'
          }),
        text: Joi.string()
          .required()
          .min(3)
          .max(500)
          .messages({
            'string.empty': 'Text cannot be empty',
            'string.min': 'Text must be at least 3 characters long',
            'string.max': 'Text cannot exceed 500 characters',
            'any.required': 'Text is required'
          })
      })
    }),
    (req, res, next) => ctrl.deleteFreeTextFromMedicalRecords(req, res, next)
  );

  app.use(errors());
};