import { Request, Response, NextFunction } from 'express';

export default interface IMedicalConditionController  {
  createMedicalCondition(req: Request, res: Response, next: NextFunction): Promise<Response>;
  partialUpdateMedicalCondition(req: Request, res: Response, next: NextFunction): Promise<Response>;
  searchMedicalConditions(req: Request, res: Response, next: NextFunction): Promise<Response>;

  //getAll(req: Request, res: Response, next: NextFunction);
}