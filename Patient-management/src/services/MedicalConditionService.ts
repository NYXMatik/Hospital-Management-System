import { Service, Inject } from 'typedi';
import config from "../../config";
import {IMedicalConditionDTO} from '../dto/IMedicalConditionDTO';
import {IMedicalConditionUpdateDTO} from '../dto/IMedicalConditionDTO';
import { MedicalCondition } from "../domain/MedicalCondition";
import IMedicalConditionRepo from './IRepos/IMedicalConditionRepo';
import { Result } from "../core/logic/Result";
import { MedicalConditionMap } from "../mappers/MedicalConditionMap";
import IMedicalConditionService from './IServices/IMedicalConditionService';
import { Code } from '../domain/Code';
import { Name } from '../domain/Name';
import { Description } from '../domain/Description';
import { CommonSymptoms } from "../domain/CommonSymptoms";

@Service()
export default class MedicalConditionService implements IMedicalConditionService {
  constructor(
      @Inject(config.repos.medicalCondition.name) private medicalConditionRepo : IMedicalConditionRepo
  ) {}


  public async createMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>> {
    try {

      const code = await Code.create(medicalConditionDTO.code);
      const designation = await Name.create(medicalConditionDTO.designation);
      const description = await Description.create( medicalConditionDTO.description );
      const commonSymptoms = CommonSymptoms.create(medicalConditionDTO.commonSymptoms);

      if (code.isFailure || designation.isFailure || description.isFailure || commonSymptoms.isFailure) {
        return Result.fail<IMedicalConditionDTO>(`${code.errorValue() || designation.errorValue() || description.errorValue() || commonSymptoms.errorValue()}`);
      }

      const medicalConditionOrError = await MedicalCondition.create( {
        medicalConditionId: code.getValue(),
        designation: designation.getValue(),
        description: description.getValue(),
        commonSymptoms: commonSymptoms.getValue()
      });

      if (medicalConditionOrError.isFailure) {
        return Result.fail<IMedicalConditionDTO>(medicalConditionOrError.errorValue());
      }

      const medicalConditionResult = medicalConditionOrError.getValue();

      const saveResult = await this.medicalConditionRepo.save(medicalConditionResult);
      
      if (saveResult.isFailure) {
        return Result.fail<IMedicalConditionDTO>(saveResult.errorValue());
      }

      const medicalConditionDTOResult = MedicalConditionMap.toDTO( medicalConditionResult ) as IMedicalConditionDTO;
      return Result.ok<IMedicalConditionDTO>( medicalConditionDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async updateMedicalCondition(code: string, updateData: IMedicalConditionUpdateDTO): Promise<Result<IMedicalConditionDTO>> {
    try {
      const existingCondition = await this.medicalConditionRepo.findByCode(code);
    
      if (!existingCondition) {
        return Result.fail('Medical condition not found');
      }

      const updatedCondition = MedicalConditionMap.partialUpdateToDomain(existingCondition, updateData);
      if (updatedCondition.isFailure) {
        return Result.fail<IMedicalConditionDTO>(updatedCondition.errorValue());
      }

      const updatedMedicalCondition = await this.medicalConditionRepo.update(updatedCondition.getValue());

      const medicalConditionDTO = MedicalConditionMap.toDTO(updatedMedicalCondition.getValue()) as IMedicalConditionDTO;
      return Result.ok<IMedicalConditionDTO>(medicalConditionDTO);

    } catch (err) {
      console.error('Error updating medical condition:', err);
      return Result.fail('Failed to update medical condition');
    }
  }

  public async searchMedicalConditions(code?: string, designation?: string): Promise<Result<IMedicalConditionDTO[]>> {
    try {
      let conditions;
  
      if (code || designation) {
        
        conditions = await this.medicalConditionRepo.searchMedicalConditions(code, designation);
        if(conditions.length === 0){
          return Result.fail("Medical conditions not found.");
        }
      } else {
        
        conditions = await this.medicalConditionRepo.getAllMedicalConditions();
        if(conditions.length === 0){
          return Result.fail("Medical conditions not found.");
        }
        
      }
  
      const conditionsDTO = MedicalConditionMap.toDTOList(conditions);
      return Result.ok<IMedicalConditionDTO[]>(conditionsDTO);
  
    } catch (error) {
      return Result.fail<IMedicalConditionDTO[]>('Failed to fetch medical conditions.');
    }
  }

}
