import { Router } from 'express';
import { celebrate, Joi, errors } from 'celebrate';

import { Container } from 'typedi';
import IAllergyController from '../../controllers/IControllers/IAllergyController'; 

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/allergy', route);

  const ctrl = Container.get(config.controllers.allergy.name) as IAllergyController;
  const allergyCodePattern = /^(?:[A-Za-z0-9]+(?:\-[A-Za-z0-9]+)*: )?[A-Za-z0-9]+(?:[-.][A-Za-z0-9]+)*$/;
  const allergyCodeMessage = 'Code must be in format "SYSTEM: CODE" (e.g., "ICD-11: RA12.0" or "SNOMED CT: 309210001") or a simple alphanumeric code with dots/hyphens';


  route.post('',
    celebrate({
      body: Joi.object({
        code: Joi.string()
          .regex(allergyCodePattern)
          .required()
          .messages({
            'string.pattern.base': allergyCodeMessage,
            'string.empty': 'Code cannot be empty.',
            'any.required': 'Code is required.',
          }),
        designation: Joi.string()
          .regex(/^(?=.*[A-Za-z])[A-Za-z0-9\s\-\(\)]+$/)
          .min(5)
          .max(50)
          .required()
          .messages({
            'string.pattern.base': 'Designation must contain at least one letter and may include alphanumeric characters (letters, numbers), spaces, hyphens (-), and parentheses.',
            'string.min': 'Designation must be at least 5 characters long.',
            'string.max': 'Designation must be at most 50 characters long.',
            'string.empty': 'Designation cannot be empty or just whitespace.',
            'any.required': 'Designation is required.',
          }),
        description: Joi.string()
          .allow(null, '') 
          .regex(/^\d+$/, { invert: true }) // Reject strings containing only numbers
          .messages({
            'string.pattern.invert.base': 'Description cannot contain only numbers.',
            'string.base': 'Description must be a string.',
          }),
      }),
    }),
    (req, res, next) => ctrl.createAllergy(req, res, next)
  );

  route.patch('/:code',
    celebrate({
      params: Joi.object({
        code: Joi.string()
        .regex(allergyCodePattern)
        .required()
        .messages({
          'string.pattern.base': allergyCodeMessage,
        })
      }),
      body: Joi.object({
        designation: Joi.string()
          .regex(/^(?=.*[A-Za-z])[A-Za-z0-9\s\-\(\)]+$/)
          .min(5)
          .max(50)
          .optional()
          .messages({
            'string.pattern.base': 'Designation must contain at least one letter and may include alphanumeric characters (letters, numbers), spaces, hyphens (-), and parentheses.',
            'string.min': 'Designation must be at least 5 characters long.',
            'string.max': 'Designation must be at most 50 characters long.',
          }),
        description: Joi.string()
          .regex(/^\d+$/, { invert: true }) // Reject strings containing only numbers
          .optional()
          .messages({
            'string.pattern.invert.base': 'Description cannot contain only numbers.',
            'string.base': 'Description must be a string.',
          }),
      }),
    }),
    (req, res, next) => ctrl.partialUpdateAllergy(req, res, next)
  );

  route.get('',
    celebrate({
      query: Joi.object({
        code: Joi.string()
          .optional()
          .allow(null, ''),
        designation: Joi.string()
          .optional()
          .allow(null, '')
      }),
    }),
    (req, res, next) => ctrl.searchAllergies(req, res, next)
  );  

  app.use(errors());
};