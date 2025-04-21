import { Container } from 'typedi';
import { Result } from "../core/logic/Result";
import { Mapper } from "../core/infra/Mapper";

import {IAllergyDTO} from "../dto/IAllergyDTO";
import {IAllergyUpdateDTO} from '../dto/IAllergyDTO';
import { Allergy } from "../domain/Allergy";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { Code } from "../domain/Code";
import { Name } from "../domain/Name";
import { Description } from "../domain/Description";

export class AllergyMap extends Mapper<Allergy> {

  public static toDTO( allergy: Allergy): IAllergyDTO {
    return {
      code: allergy.allergyId.value,
      designation: allergy.designation.value,
      description: allergy.description.value
    } as IAllergyDTO;
  }

  public static toDTOList(allergies: Allergy[]): IAllergyDTO[] {
    return allergies.map(c => ({
      code: c.allergyId.value,
      designation: c.designation.value,
      description: c.description.value
    }));
  }

  public static async toDomain (raw: any): Promise<Allergy> {
    const codeOrError = Code.create(raw.code);
    const designationOrError = Name.create(raw.designation);
    const descriptionOrError = Description.create(raw.description);

    const allergyOrError = Allergy.create({
      allergyId: codeOrError.getValue(),
      designation: designationOrError.getValue(),
      description: descriptionOrError.getValue(),
    }, new UniqueEntityID(raw.domainId))

    allergyOrError.isFailure ? console.log(allergyOrError.error) : '';
    
    return allergyOrError.isSuccess ? allergyOrError.getValue() : null;
  }

  public static async toDomainList(rawArray: any[]): Promise<Allergy[]> {
    const allergies: Allergy[] = [];
  
    for (const raw of rawArray) {
      const allergy = await this.toDomain(raw);
      if (allergy) {
        allergies.push(allergy);
      }
    }
  
    return allergies;
  }

  public static toPersistence (allergy: Allergy): any {
    const a = {
      code: allergy.allergyId.value,
      designation: allergy.designation.value,
      description: allergy.description.value,
    }
    return a;
  }

  public static partialUpdateToDomain(existingModel: Allergy, updateData: Partial<IAllergyUpdateDTO>): Result<Allergy> {
    let updatedDesignation = existingModel.designation;
    let updatedDescription = existingModel.description;
  
    // Updates the designation field if provided
    if (updateData.designation) {
      const designationOrError = Name.create(updateData.designation);
      if (designationOrError.isFailure) {
        return Result.fail<Allergy>(designationOrError.errorValue());
      }
      updatedDesignation = designationOrError.getValue();
    }
  
    // Updates the description field if provided
    if (updateData.description) {
      const descriptionOrError = Description.create(updateData.description);
      if (descriptionOrError.isFailure) {
        return Result.fail<Allergy>(descriptionOrError.errorValue());
      }
      updatedDescription = descriptionOrError.getValue();
    }

    const updatedAllergy = Allergy.create(
      {
        allergyId: existingModel.allergyId,
        designation: updatedDesignation,
        description: updatedDescription,
      },
      existingModel.id
    );
  
    return updatedAllergy;
  }

}