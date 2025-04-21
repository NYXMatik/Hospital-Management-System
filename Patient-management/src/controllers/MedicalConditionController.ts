import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IMedicalConditionController from "./IControllers/IMedicalConditionController";
import IMedicalConditionService from '../services/IServices/IMedicalConditionService';
import {IMedicalConditionDTO} from '../dto/IMedicalConditionDTO';
import {IMedicalConditionUpdateDTO} from '../dto/IMedicalConditionDTO';

import { Result } from "../core/logic/Result";

@Service()
export default class MedicalConditionController implements IMedicalConditionController /* TODO: extends ../core/infra/BaseController */ {
  constructor(
      @Inject(config.services.medicalCondition.name) private medicalConditionServiceInstance : IMedicalConditionService
  ) {}

  public async createMedicalCondition(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      
      const medicalConditionOrError = await this.medicalConditionServiceInstance.createMedicalCondition(req.body as IMedicalConditionDTO) as Result<IMedicalConditionDTO>;
        
      if (medicalConditionOrError.isFailure) {
        return res.status(400).json({
          errors: { message: medicalConditionOrError.errorValue() }
        });
      }

      const medicalConditionDTO = medicalConditionOrError.getValue();
      return res.status(201).json( medicalConditionDTO );
    }
    catch (e) {
      next(e);
    }
  };

  public async partialUpdateMedicalCondition(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { code } = req.params;   
    const updateData: IMedicalConditionUpdateDTO = req.body;

    if (!updateData.designation && !updateData.description) {
      return res.status(400).json({ message: 'At least one field (designation or description) must be provided.' });
    }

    try {
      const medicalConditionOrError = await this.medicalConditionServiceInstance.updateMedicalCondition(code, updateData);

      if (medicalConditionOrError.isFailure) {
        return res.status(400).json({ message: medicalConditionOrError.errorValue() });
      }

      const medicalConditionDTO = medicalConditionOrError.getValue();
      return res.status(200).json(medicalConditionDTO);

    } catch (e) {
      next(e);
    }
  }

  public async searchMedicalConditions(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { code, designation } = req.query;
  
    try {
      const conditionsOrError = await this.medicalConditionServiceInstance.searchMedicalConditions(code as string, designation as string);
  
      if (conditionsOrError.isFailure) {
        return res.status(400).json({ message: conditionsOrError.errorValue() });
      }
  
      const conditions = conditionsOrError.getValue();
      return res.status(200).json(conditions);
  
    } catch (e) {
      next(e);
    }
  }
  
}