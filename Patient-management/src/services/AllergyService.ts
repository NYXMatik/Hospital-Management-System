import { Service, Inject } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";

import { Allergy } from "../domain/Allergy";
import {IAllergyDTO} from '../dto/IAllergyDTO';
import {IAllergyUpdateDTO} from '../dto/IAllergyDTO';
import IAllergyRepo from './IRepos/IAllergyRepo';
import { AllergyMap } from "../mappers/AllergyMap";
import IAllergyService from './IServices/IAllergyService';

import { Code } from '../domain/Code';
import { Name } from '../domain/Name';
import { Description } from '../domain/Description';

@Service()
export default class AllergyService implements IAllergyService {
  constructor(
      @Inject(config.repos.allergy.name) private allergyRepo : IAllergyRepo
  ) {}

  public async createAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>> {
    try {

      const code = await Code.create(allergyDTO.code);
      const designation = await Name.create(allergyDTO.designation);
      const description = await Description.create( allergyDTO.description );

      if (code.isFailure || designation.isFailure || description.isFailure) {
        return Result.fail<IAllergyDTO>(`${code.errorValue() || designation.errorValue() || description.errorValue()}`);
      }      

      const allergyOrError = await Allergy.create( {
        allergyId: code.getValue(),
        designation: designation.getValue(),
        description: description.getValue()
      });

      if (allergyOrError.isFailure) {
        return Result.fail<IAllergyDTO>(allergyOrError.errorValue());
      }

      const allergyResult = allergyOrError.getValue();

      const saveResult = await this.allergyRepo.save(allergyResult);

      if (saveResult.isFailure) {
        return Result.fail<IAllergyDTO>(saveResult.errorValue());
      }      

      const roleDTOResult = AllergyMap.toDTO( allergyResult ) as IAllergyDTO;
      return Result.ok<IAllergyDTO>( roleDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async updateAllergy(code: string, updateData: IAllergyUpdateDTO): Promise<Result<IAllergyDTO>> {
    try {
      const existingAllergy = await this.allergyRepo.findByCode(code);
    
      if (!existingAllergy) {
        return Result.fail('Allergy not found');
      }

      const allergy = AllergyMap.partialUpdateToDomain(existingAllergy, updateData);
      if (allergy.isFailure) {
        return Result.fail<IAllergyDTO>(allergy.errorValue());
      }

      const updatedAllergy = await this.allergyRepo.update(allergy.getValue());

      const allergyDTO = AllergyMap.toDTO(updatedAllergy.getValue()) as IAllergyDTO;
      return Result.ok<IAllergyDTO>(allergyDTO);

    } catch (err) {
      console.error('Error updating allergy:', err);
      return Result.fail('Failed to update allergy');
    }
  }  

  public async searchAllergies(code?: string, designation?: string): Promise<Result<IAllergyDTO[]>> {
    try {
      let allergies;
  
      if (code || designation) {
        
        allergies = await this.allergyRepo.searchAllergies(code, designation);
        if(allergies.length === 0){
          return Result.fail("Allergy not found.");
        }
      } else {
        allergies = await this.allergyRepo.getAllAllergies();

        if(allergies.length === 0){
          return Result.fail("Allergy not found.");
        }
      }
  
      const allergiesDTO = AllergyMap.toDTOList(allergies);
      return Result.ok<IAllergyDTO[]>(allergiesDTO);
  
    } catch (error) {
      return Result.fail<IAllergyDTO[]>('Failed to fetch allergies.');
    }
  }

}
