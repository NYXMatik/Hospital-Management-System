import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IMedicalRecordController from "./IControllers/IMedicalRecordController";
import IMedicalRecordService from '../services/IServices/IMedicalRecordService';
import { IMedicalRecordDTO } from '../dto/IMedicalRecordDTO';

import { Result } from "../core/logic/Result";
import { IMedicalRecordAllergyDTO } from '../dto/IMedicalRecordAllergyDTO';

@Service()
export default class MedicalRecordController implements IMedicalRecordController {
  constructor(
    @Inject(config.services.medicalRecord.name) private medicalRecordServiceInstance: IMedicalRecordService
  ) {}

  public async createMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      console.log("Reached Controller");

      const medicalRecordOrError = await this.medicalRecordServiceInstance.createMedicalRecord(req.body as IMedicalRecordDTO) as Result<IMedicalRecordDTO>;

      console.log("Result:", medicalRecordOrError);

      if (medicalRecordOrError.isFailure) {
        res.status(400).json({
          errors: { message: medicalRecordOrError.errorValue() }
        });
        return;
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();
      res.status(201).json(medicalRecordDTO);
    } catch (e) {
      console.error('Error creating medical record:', e); // Log the error for debugging
      res.status(500).json({
        errors: { message: 'Failed to create medical record', details: e.message }
      });
    }
  }

  public async getMedicalRecordById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const medicalRecordOrError = await this.medicalRecordServiceInstance.getMedicalRecordById(req.params.id) as Result<IMedicalRecordDTO | IMedicalRecordAllergyDTO>;

      if (medicalRecordOrError.isFailure) {
        res.status(404).json({
          errors: { message: medicalRecordOrError.errorValue() }
        });
        return;
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();
      res.status(200).json(medicalRecordDTO);
    } catch (e) {
      console.error('Error fetching medical record:', e); // Log the error for debugging
      res.status(500).json({
        errors: { message: 'Failed to fetch medical record', details: e.message }
      });
    }
  }

  public async getAllMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      console.log("Reached Controller");
      
      const medicalRecordsOrError = await this.medicalRecordServiceInstance.getAllMedicalRecords() as Result<IMedicalRecordDTO[] | IMedicalRecordAllergyDTO[]>;
      
      if (medicalRecordsOrError.isFailure) {
        res.status(400).json({
          errors: { message: medicalRecordsOrError.errorValue() }
        });
        return;
      }

      console.log("Reached Controller 2");

      res.status(200).json(medicalRecordsOrError);

      console.log("body of response", JSON.stringify(medicalRecordsOrError));
    } catch (e) {
      console.error('Error fetching all medical records:', e); // Log the error for debugging
      res.status(500).json({
        errors: { message: 'Failed to fetch all medical records', details: e.message }
      });
    }
  }
  public async getMedicalRecordByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const medicalRecordOrError = await this.medicalRecordServiceInstance.getMedicalRecordByUser(req.params.userId) as Result<IMedicalRecordDTO | IMedicalRecordAllergyDTO>;
      console.log("\n\n\n\nReached Controller");
      console.log("Medical Record:", medicalRecordOrError);
      console.log("Medical Record Value:", medicalRecordOrError.getValue());
      console.log("Medical Record Condition:", medicalRecordOrError.getValue().medicalConditions);
      console.log("Medical Record Condition 2:", medicalRecordOrError.getValue().medicalConditions[0]);



      if (medicalRecordOrError.isFailure) {
        res.status(404).json({
          errors: { message: medicalRecordOrError.errorValue() }
        });
        return;
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();
      res.status(200).json(medicalRecordDTO);
    } catch (e) {
      console.error('Error fetching medical record by user:', e); // Log the error for debugging
      res.status(500).json({
        errors: { message: 'Failed to fetch medical record by user', details: e.message }
      });
    }
  }
  public async updateMedicalConditions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("Reached Controller");
      
      const userId = req.params.userId;
      // Extract condition codes from request body
      const medicalConditions = req.body.medicalConditions.map(condition => 
        typeof condition === 'string' ? condition : condition.code
      );
  
      console.log("Transformed conditions:", medicalConditions);
  
      const result = await this.medicalRecordServiceInstance.updateMedicalConditions(userId, medicalConditions);
  
      console.log("Service result:", result);
  
      if (result.isFailure) {
        res.status(400).json({
          errors: { message: result.errorValue() }
        });
        return;
      }
  
      const medicalRecordDTO = result.getValue();
      res.status(200).json(medicalRecordDTO);
    } catch (e) {
      console.error('Error updating medical conditions:', e);
      res.status(500).json({
        errors: { message: 'Failed to update medical conditions', details: e.message }
      });
    }
  }
  
  public async getMedicalRecordsByConditionSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, designation } = req.query;
      
      // Input validation
      if (!code && !designation) {
        res.status(400).json({
          errors: { message: 'Either code or designation must be provided' }
        });
        return;
      }

      console.log(`Searching medical records with code: ${code}, designation: ${designation}`);
      
      const result = await this.medicalRecordServiceInstance.getMedicalRecordsByConditionSearch(
        code as string, 
        designation as string
      );

      if (result.isFailure) {
        res.status(404).json({
          errors: { message: result.errorValue() }
        });
        return;
      }

      const medicalRecords: IMedicalRecordAllergyDTO[] = result.getValue();
      console.log(`Found ${medicalRecords.length} matching records`);
      
      res.status(200).json(medicalRecords);
    } catch (e) {
      console.error('Error fetching medical records by condition search:', e);
      res.status(500).json({
        errors: { 
          message: 'Failed to fetch medical records by condition search',
          details: e.message 
        }
      });
    }
  }

  public async replaceMedicalConditions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      console.log("Reached Controller");

      const userId = req.params.userId;
      const code = req.body.code;
      const designation = req.body.designation;
      const description = req.body.description;
      const commonSymptoms = req.body.commonSymptoms;

      const medicalRecordOrError = await this.medicalRecordServiceInstance.replaceMedicalConditions(userId, code, designation, description, commonSymptoms);

      if (medicalRecordOrError.isFailure) {
        res.status(400).json({
          errors: { message: medicalRecordOrError.errorValue() }
        });
        return;
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();
      res.status(200).json(medicalRecordDTO);
    } catch (e) {
      console.error('Error replacing medical record:', e); // Log the error for debugging
      res.status(500).json({
        errors: { message: 'Failed to replace medical record', details: e.message }
      });
    }
  }
}