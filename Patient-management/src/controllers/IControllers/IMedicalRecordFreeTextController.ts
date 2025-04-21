import { Request, Response, NextFunction } from 'express';

export default interface IMedicalRecordFreeTextController {
  addFreeTextToMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateFreeTextInMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void>;
}