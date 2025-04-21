import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import IMedicalRecordFreeTextController from './IControllers/IMedicalRecordFreeTextController';
import IMedicalRecordService from '../services/IServices/IMedicalRecordService';

@Service()
export default class MedicalRecordFreeTextController implements IMedicalRecordFreeTextController {
  constructor(
    @Inject('medicalRecordService') private medicalRecordService: IMedicalRecordService
  ) {}

  public async addFreeTextToMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.query;
      const { text } = req.body;
      const result = await this.medicalRecordService.addFreeTextToMedicalRecords(userId as string, text);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error adding free text to medical record:', error);
      res.status(500).json({
        errors: { message: 'Failed to add free text to medical record', details: error.message }
      });
    }
  }

  public async updateFreeTextInMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.query;
      const { text } = req.body;
      const result = await this.medicalRecordService.updateFreeTextInMedicalRecords(userId as string, text);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error updating free text in medical record:', error);
      res.status(500).json({
        errors: { message: 'Failed to update free text in medical record', details: error.message }
      });
    }
  }
}