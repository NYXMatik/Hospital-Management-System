import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IMedicalRecordAllergyController from "./IControllers/IMedicalRecordAllergyController";
import IMedicalRecordService from '../services/IServices/IMedicalRecordService';
import { Result } from "../core/logic/Result";

@Service()
export default class MedicalRecordAllergyController implements IMedicalRecordAllergyController {
  constructor(
    @Inject(config.services.medicalRecord.name) private medicalRecordServiceInstance: IMedicalRecordService
  ) {}

  public async updateAllergies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.query.userId as string; // Changed from params to query
      const allergies = req.body.allergies;

      console.log("Reached Controller");

      const result = await this.medicalRecordServiceInstance.updateAllergies(userId, allergies);
      console.log('Allergies updated:', result.getValue());
      if (result.isFailure) {
        res.status(400).json({
          errors: { message: result.errorValue() }
        });
        return;
      }

      const medicalRecordDTO = result.getValue();
      res.status(200).json(medicalRecordDTO);
    } catch (e) {
      console.error('Error updating allergies:', e);
      res.status(500).json({
        errors: { message: 'Failed to update allergies', details: e.message }
      });
    }
  }

  public async searchMedicalRecordsByAllergy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.query;
      console.log('\n\nSearching by allergy code:', code);
      
      const result = await this.medicalRecordServiceInstance.getMedicalRecordsByAllergySearch(code as string);
  
      if (result.isFailure) {
        res.status(400).json({
          errors: { message: result.errorValue() }
        });
        return;
      }
  
      const medicalRecords = result.getValue();
      res.status(200).json(medicalRecords);
    } catch (e) {
      console.error('Error searching medical records by allergy:', e);
      res.status(500).json({
        errors: { message: 'Failed to search medical records by allergy', details: e.message }
      });
    }
  }

  public async deleteAllergyFromMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const code = req.query.code as string;
      const userId = req.query.userId as string;
      console.log('Deleting allergy from medical records:', code);
      
      const result = await this.medicalRecordServiceInstance.deleteAllergyFromMedicalRecords(userId, code);
  
      if (result.isFailure) {
        res.status(400).json({
          errors: { message: result.errorValue() }
        });
        return;
      }
  
      res.status(200).json({ message: 'Allergy deleted from medical records' });
    } catch (e) {
      console.error('Error deleting allergy from medical records:', e);
      res.status(500).json({
        errors: { message: 'Failed to delete allergy from medical records', details: e.message }
      });
    }
  }

  public async searchMedicalRecordsByAllergyAndUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, userId } = req.query;
      console.log('Searching by allergy code:', code, 'and user ID:', userId);
      
      const result = await this.medicalRecordServiceInstance.searchMedicalRecordsByAllergyAndUser( userId as string, code as string);
      
      console.log('Result:', result);

      if (result.isFailure) {
        res.status(400).json({
          errors: { message: result.errorValue() }
        });
        return;
      }
  
      const medicalRecords = result.getValue();
      res.status(200).json(medicalRecords);
    } catch (e) {
      console.error('Error searching medical records by allergy and user:', e);
      res.status(500).json({
        errors: { message: 'Failed to search medical records by allergy and user', details: e.message }
      });
    }
  }

  public async updateAllergyInMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      console.log('Updating allergy in medical records');

      const { userId } = req.query;
      const updateData = req.body;
      const code = updateData.Code;
      console.log('Updating allergy:', code);
      console.log('Update data:', updateData);
      
      if (!updateData.Designation && !updateData.Description) {
        res.status(400).json({ message: 'At least one field (designation or description) must be provided.' });
        return;
      }

      const result = await this.medicalRecordServiceInstance.updateAllergy(userId as string, code as string, updateData.Designation, updateData.Description);

      if (result.isFailure) {
        res.status(400).json({ message: result.errorValue() });
        return;
      }

      const medicalRecordDTO = result.getValue();
      res.status(200).json(medicalRecordDTO);
    } catch (e) {
      console.error('Error updating allergy:', e);
      res.status(500).json({
        errors: { message: 'Failed to update allergy', details: e.message }
      });
    }
  }
}