import { Request, Response, NextFunction } from 'express';

export default interface IMedicalRecordController {
  createMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMedicalRecordById(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMedicalRecordByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateMedicalConditions(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMedicalRecordsByConditionSearch(req: Request, res: Response, next: NextFunction): Promise<void>
  replaceMedicalConditions(req: Request, res: Response, next: NextFunction): Promise<void>;
}