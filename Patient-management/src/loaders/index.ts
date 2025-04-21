import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';
import { seedAllergies } from './seedAllergy';
import AllergySchema from '../persistence/schemas/AllergySchema';
import { seedMedicalConditions } from './seedMedicalCondition';
import MedicalConditionSchema from '../persistence/schemas/MedicalConditionSchema';

import config from '../../config';
import path from 'path';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const allergiesCount = await AllergySchema.countDocuments();
  if (allergiesCount === 0) {
    await seedAllergies();
    Logger.info('✌️ Allergy seed data loaded!');
  }

  const medicalConditionsCount = await MedicalConditionSchema.countDocuments();
  if (medicalConditionsCount === 0) {
    await seedMedicalConditions();
    Logger.info('✌️ Medical condition seed data loaded!');
  }

  const medicalConditionSchema = {
    name: 'medicalConditionSchema',
    schema: '../persistence/schemas/MedicalConditionSchema',
  };

  const medicalConditionController = {
    name: config.controllers.medicalCondition.name,
    path: config.controllers.medicalCondition.path
  }

  const medicalConditionRepo = {
    name: config.repos.medicalCondition.name,
    path: config.repos.medicalCondition.path
  }

  const medicalConditionService = {
    name: config.services.medicalCondition.name,
    path: config.services.medicalCondition.path
  }

  const allergySchema = {
    name: 'allergySchema',
    schema: '../persistence/schemas/AllergySchema',
  };

  const allergyController = {
    name: config.controllers.allergy.name,
    path: config.controllers.allergy.path
  }

  const allergyRepo = {
    name: config.repos.allergy.name,
    path: config.repos.allergy.path
  }

  const allergyService = {
    name: config.services.allergy.name,
    path: config.services.allergy.path
  }

  const medicalRecordSchema = {
    name: 'medicalRecordSchema',
    schema: '../persistence/schemas/MedicalRecordSchema',
  };

  const medicalRecordController = {
    name: config.controllers.medicalRecord.name,
    path: config.controllers.medicalRecord.path
  }

  const medicalRecordRepo = {
    name: config.repos.medicalRecord.name,
    path: config.repos.medicalRecord.path
  }

  const medicalRecordService = {
    name: config.services.medicalRecord.name,
    path: config.services.medicalRecord.path
  }

  const medicalRecordAllergyController = {
    name: config.controllers.medicalRecordAllergy.name,
    path: config.controllers.medicalRecordAllergy.path
  }

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      medicalConditionSchema,
      allergySchema,
      medicalRecordSchema
    ],
    controllers: [
      medicalConditionController,
      allergyController,
      medicalRecordController,
      medicalRecordAllergyController
    ],
    repos: [
      medicalConditionRepo,
      allergyRepo,
      medicalRecordRepo
    ],
    services: [
      medicalConditionService,
      allergyService,
      medicalRecordService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};