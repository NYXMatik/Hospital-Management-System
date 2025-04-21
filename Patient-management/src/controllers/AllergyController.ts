import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IAllergyController from "./IControllers/IAllergyController";
import IAllergyService from '../services/IServices/IAllergyService';
import {IAllergyDTO} from '../dto/IAllergyDTO';
import {IAllergyUpdateDTO} from '../dto/IAllergyDTO';

import { Result } from "../core/logic/Result";

@Service()
export default class AllergyController implements IAllergyController /* TODO: extends ../core/infra/BaseController */ {
  constructor(
      @Inject(config.services.allergy.name) private allergyServiceInstance : IAllergyService
  ) {}

  public async createAllergy(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const allergyOrError = await this.allergyServiceInstance.createAllergy(req.body as IAllergyDTO) as Result<IAllergyDTO>;
        
      if (allergyOrError.isFailure) {
        return res.status(400).json({
          errors: { message: allergyOrError.errorValue() }
        });
      }

      const allergyDTO = allergyOrError.getValue();
      return res.status(201).json( allergyDTO );
    }
    catch (e) {
      next(e);
    }
  };
  

  public async partialUpdateAllergy(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { code } = req.params;   
    const updateData: IAllergyUpdateDTO = req.body;

    if (!updateData.designation && !updateData.description) {
      return res.status(400).json({ message: 'At least one field (designation or description) must be provided.' });
    }

    try {
      const allergyOrError = await this.allergyServiceInstance.updateAllergy(code, updateData);

      if (allergyOrError.isFailure) {
        return res.status(400).json({ message: allergyOrError.errorValue() });
      }

      const allergyDTO = allergyOrError.getValue();
      return res.status(200).json(allergyDTO);

    } catch (e) {
      next(e);
    }
  }

  public async searchAllergies(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { code, designation } = req.query;
  
    try {
      const allergiesOrError = await this.allergyServiceInstance.searchAllergies(code as string, designation as string);
  
      if (allergiesOrError.isFailure) {
        return res.status(400).json({ message: allergiesOrError.errorValue() });
      }
  
      const allergies = allergiesOrError.getValue();
      return res.status(200).json(allergies);
  
    } catch (e) {
      next(e);
    }
  }

}