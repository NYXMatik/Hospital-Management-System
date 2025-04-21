import { Request, Response, NextFunction } from 'express';

export default interface IMedicalRecordAllergyController {
  updateAllergies(req: Request, res: Response, next: NextFunction): Promise<void>;
  searchMedicalRecordsByAllergy(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteAllergyFromMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void>;
  searchMedicalRecordsByAllergyAndUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateAllergyInMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void>;
}