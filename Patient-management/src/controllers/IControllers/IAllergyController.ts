import { Request, Response, NextFunction } from 'express';

export default interface IAllergyController  {
  createAllergy(req: Request, res: Response, next: NextFunction): Promise<Response>;
  partialUpdateAllergy(req: Request, res: Response, next: NextFunction): Promise<Response>;
  searchAllergies(req: Request, res: Response, next: NextFunction): Promise<Response>;
}