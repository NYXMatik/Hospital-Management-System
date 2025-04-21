import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IMedicalRecordController from '../../controllers/IControllers/IMedicalRecordController'; 

import config from "../../../config";
import { log } from 'console';

const route = Router();

export default (app: Router) => {
  app.use('/medical-records', route);

  const ctrl = Container.get(config.controllers.medicalRecord.name) as IMedicalRecordController;

  const logRequestDetails = (req, res, next) => {
    console.log('Received request:', {
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      body: req.body
    });
    next();
  };

  route.post('',
      logRequestDetails,
      (req, res, next) => {
          // Log original request
          console.log('Original request body:', req.body);

          // Convert PascalCase to camelCase
          const convertedBody = {
              userId: req.body.userId || req.body.UserId, // Try both casings
              medicalConditions: req.body.MedicalConditions || [],
              allergies: req.body.Allergies || [],
              freeTexts: req.body.freeTexts ||' '
          };
          
          // Replace original request body
          req.body = convertedBody;
          
          console.log('Converted body:', req.body);
          next();
      },
      celebrate({
          body: Joi.object({
              userId: Joi.string().required(),
              medicalConditions: Joi.array().items(Joi.string()).sparse().optional(),
              allergies: Joi.array().items(Joi.string()).sparse().optional(),
              freeTexts: Joi.string().optional()
          }).unknown(false)
      }, {
          abortEarly: false
      }),
      (req, res, next) => ctrl.createMedicalRecord(req, res, next)
  );

  route.get('',
    async (req, res, next) => {
      try {
        console.log('GET /medical-records - Request received\n\n');
        
  
        await ctrl.getAllMedicalRecords(req, res as any, next);



        console.log('\n\nGET /medical-records - Response sent');


        console.log('--------------------------------------------------');
        
        
      } catch (err) {
        console.error('GET /medical-records - Error:', err);
        next(err);
      }

      // Log response
      res.on('finish', () => {
        console.log('GET /medical-records - Response:', res.statusCode);
        console.log('--------------------------------------------------');
      });
    }
  );


  route.get('/user/:userId',
    logRequestDetails,
    celebrate({
      params: Joi.object({
        userId: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.getMedicalRecordByUser(req, res, next)
  );

  route.patch('/medical-conditions/:userId',
    logRequestDetails,
    celebrate({
      params: Joi.object({
        userId: Joi.string().required()
      }),
      body: Joi.object({
        medicalConditions: Joi.array().items(
          Joi.alternatives().try(
            Joi.string(),
            Joi.object({
              code: Joi.string().required()
            })
          )
        ).required()
      })
    }),
    (req, res, next) => ctrl.updateMedicalConditions(req, res, next)
  );

  route.put('/medical-conditions/:userId',
    logRequestDetails,
    celebrate({
      params: Joi.object({
        userId: Joi.string().required()
      }),
      body: Joi.object({
            code: Joi.string().required(),
            designation: Joi.string().required(),
            description: Joi.string().required(),
            commonSymptoms: Joi.array().items(Joi.string()).required()
      })
    }),
    (req, res, next) => ctrl.replaceMedicalConditions(req, res, next)
  );
  
};