import { Result } from "../core/logic/Result";
import { Mapper } from "../core/infra/Mapper";

import {IMedicalConditionDTO} from "../dto/IMedicalConditionDTO";
import {IMedicalConditionUpdateDTO} from '../dto/IMedicalConditionDTO';
import { MedicalCondition } from "../domain/MedicalCondition";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { Code } from "../domain/Code";
import { Name } from "../domain/Name";
import { Description } from "../domain/Description";
import { CommonSymptoms } from "../domain/CommonSymptoms";

export class MedicalConditionMap extends Mapper<MedicalCondition> {

  public static toDTO( medicalCondition: MedicalCondition): IMedicalConditionDTO {
    return {
      code: medicalCondition.medicalConditionId.value,
      designation: medicalCondition.designation.value,
      description: medicalCondition.description.value,
      commonSymptoms: medicalCondition.commonSymptoms.value
    } as IMedicalConditionDTO;
  }

  public static toDTOList(medicalConditions: MedicalCondition[]): IMedicalConditionDTO[] {
    return medicalConditions.map(c => ({
      code: c.medicalConditionId.value,
      designation: c.designation.value,
      description: c.description.value,
      commonSymptoms: c.commonSymptoms.value
    }));
  }  

  public static async toDomain (raw: any): Promise<MedicalCondition> {
    const codeOrError = Code.create(raw.code);
    const designationOrError = Name.create(raw.designation);
    const descriptionOrError = Description.create(raw.description);
    const commonSymptomsOrError = CommonSymptoms.create(raw.commonSymptoms);

    const medicalConditionOrError = MedicalCondition.create({
      medicalConditionId: codeOrError.getValue(),
      designation: designationOrError.getValue(),
      description: descriptionOrError.getValue(),
      commonSymptoms: commonSymptomsOrError.getValue(),
    }, new UniqueEntityID(raw.domainId))

    medicalConditionOrError.isFailure ? console.log(medicalConditionOrError.error) : '';
    
    return medicalConditionOrError.isSuccess ? medicalConditionOrError.getValue() : null;
  }

  public static async toDomainList(rawArray: any[]): Promise<MedicalCondition[]> {
    const medicalConditions: MedicalCondition[] = [];
  
    for (const raw of rawArray) {
      const medicalCondition = await this.toDomain(raw);
      if (medicalCondition) {
        medicalConditions.push(medicalCondition);
      }
    }
    

    return medicalConditions;
  }
  
  public static toPersistence (medicalCondition: MedicalCondition): any {
    const a = {
      code: medicalCondition.medicalConditionId.value,
      designation: medicalCondition.designation.value,
      description: medicalCondition.description.value,
      commonSymptoms: medicalCondition.commonSymptoms.value,
    }
    return a;
  }

  public static partialUpdateToDomain(existingModel: MedicalCondition, updateData: Partial<IMedicalConditionUpdateDTO>): Result<MedicalCondition> {
    let updatedDesignation = existingModel.designation;
    let updatedDescription = existingModel.description;
  
    // Updates the designation field if provided
    if (updateData.designation) {
      const designationOrError = Name.create(updateData.designation);
      if (designationOrError.isFailure) {
        return Result.fail<MedicalCondition>(designationOrError.errorValue());
      }
      updatedDesignation = designationOrError.getValue();
    }
  
    // Updates the description field if provided
    if (updateData.description) {
      const descriptionOrError = Description.create(updateData.description);
      if (descriptionOrError.isFailure) {
        return Result.fail<MedicalCondition>(descriptionOrError.errorValue());
      }
      updatedDescription = descriptionOrError.getValue();
    }

    const updatedMedicalCondition = MedicalCondition.create(
      {
        medicalConditionId: existingModel.medicalConditionId,
        designation: updatedDesignation,
        description: updatedDescription,
        commonSymptoms: existingModel.commonSymptoms,
      },
      existingModel.id
    );
  
    return updatedMedicalCondition;
  }
  
  public static async toDomainName (raw: any): Promise<MedicalCondition> {
    const codeOrError = Code.create(raw.code);
    const designationOrError = Name.create(raw.name);
    const descriptionOrError = Description.create(raw.description);
    const commonSymptomsOrError = CommonSymptoms.create(raw.commonSymptoms);

    const medicalConditionOrError = MedicalCondition.create({
      medicalConditionId: codeOrError.getValue(),
      designation: designationOrError.getValue(),
      description: descriptionOrError.getValue(),
      commonSymptoms: commonSymptomsOrError.getValue(),
    }, new UniqueEntityID(raw.domainId))

    medicalConditionOrError.isFailure ? console.log(medicalConditionOrError.error) : '';
    
    return medicalConditionOrError.isSuccess ? medicalConditionOrError.getValue() : null;
  }

  

  public static async toDomainListName(rawArray: any[]): Promise<MedicalCondition[]> {
    const medicalConditions: MedicalCondition[] = [];
  
    for (const raw of rawArray) {
      const medicalCondition = await this.toDomainName(raw);
      if (medicalCondition) {
        medicalConditions.push(medicalCondition);
      }
    }
    

    return medicalConditions;
  }

}