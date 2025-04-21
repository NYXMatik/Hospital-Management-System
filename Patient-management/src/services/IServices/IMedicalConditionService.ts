import { Result } from "../../core/logic/Result";
import { IMedicalConditionDTO } from "../../dto/IMedicalConditionDTO";
import {IMedicalConditionUpdateDTO} from '../../dto/IMedicalConditionDTO';

export default interface IMedicalConditionService  {
  createMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>>;

  updateMedicalCondition(code: string, updates: IMedicalConditionUpdateDTO): Promise<Result<IMedicalConditionDTO>>;

  searchMedicalConditions(code?: string, designation?: string): Promise<Result<IMedicalConditionDTO[]>>;

  //getAll(): Promise<Result<IMedicalConditionDTO[]>>;
}
