import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4020, 

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/test",

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    medicalCondition: {
      name: "MedicalConditionController",
      path: "../controllers/MedicalConditionController"
    },
    allergy: {
      name: "AllergyController",
      path: "../controllers/AllergyController"
    },
    medicalRecord: {
      name: "MedicalRecordController",
      path: "../controllers/MedicalRecordController"
    },
    medicalRecordAllergy: {
      name: 'MedicalRecordAllergyController',
      path: "../controllers/MedicalRecordAllergyController"
    }
  },

  repos: {
    medicalCondition: {
      name: "MedicalConditionRepo",
      path: "../repos/MedicalConditionRepo"
    },
    allergy: {
      name: "AllergyRepo",
      path: "../repos/AllergyRepo"
    },
    medicalRecord: {
      name: "MedicalRecordRepo",
      path: "../repos/MedicalRecordRepo"
    }
  },

  services: {
    medicalCondition: {
      name: "MedicalConditionService",
      path: "../services/MedicalConditionService"
    },
    allergy: {
      name: "AllergyService",
      path: "../services/AllergyService"
    },
    medicalRecord: {
      name: "MedicalRecordService",
      path: "../services/MedicalRecordService"
    }
  },
};