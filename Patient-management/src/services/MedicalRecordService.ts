import { Service, Inject } from 'typedi';
import config from "../../config";
import { IMedicalRecordDTO } from '../dto/IMedicalRecordDTO';
import { MedicalRecord } from "../domain/MedicalRecord";
import IMedicalRecordRepo from './IRepos/IMedicalRecordRepo';
import { Result } from "../core/logic/Result";
import { MedicalRecordMap } from "../mappers/MedicalRecordMap";
import IMedicalRecordService from './IServices/IMedicalRecordService';
import MedicalConditionRepo from '../repos/MedicalConditionRepo';
import AllergyRepo from '../repos/AllergyRepo';
import { MedicalCondition } from '../domain/MedicalCondition';
import { Allergy } from '../domain/Allergy';
import IMedicalConditionService from './IServices/IMedicalConditionService';
import IAllergyService from './IServices/IAllergyService';
import { IMedicalRecordAllergyDTO } from '../dto/IMedicalRecordAllergyDTO';
import { Code } from '../domain/Code';

@Service()
export default class MedicalRecordService implements IMedicalRecordService {
  constructor(
    @Inject(config.repos.medicalRecord.name) private medicalRecordRepo: IMedicalRecordRepo,
    @Inject(config.repos.medicalCondition.name) private medicalConditionRepo: MedicalConditionRepo,
    @Inject(config.repos.allergy.name) private allergyRepo: AllergyRepo,
    @Inject(config.services.medicalCondition.name) private medicalConditionService: IMedicalConditionService,
    @Inject(config.services.allergy.name) private allergyService: IAllergyService
  ) {}

  public async createMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO | IMedicalRecordAllergyDTO>> {
    try {
      const existingRecord = await this.medicalRecordRepo.findByUserId(medicalRecordDTO.userId);
      if (existingRecord) {
        return Result.fail<IMedicalRecordDTO>('A medical record with this userId already exists');
      }
      const medicalConditions = await Promise.all(medicalRecordDTO.medicalConditions.map(async (code: string) => {
        return await this.medicalConditionRepo.findByCode(code);
      }));

      const allergies = await Promise.all(medicalRecordDTO.allergies.map(async (code: string) => {
        return await this.allergyRepo.findByCode(code);
      }));

      if (medicalConditions.includes(null) || allergies.includes(null)) {
        return Result.fail<IMedicalRecordDTO>('One or more medical conditions or allergies not found');
      }

      console.log(".", medicalRecordDTO.freeTexts, ".");

      if  (medicalRecordDTO.freeTexts === undefined) {
        medicalRecordDTO.freeTexts = "";
      }

      const medicalRecordOrError = MedicalRecord.create({
        userId: medicalRecordDTO.userId,
        medicalConditions: medicalConditions.filter(mc => mc !== null) as MedicalCondition[],
        allergies: allergies.filter(a => a !== null) as Allergy[],
        freeTexts: medicalRecordDTO.freeTexts
      });

      if (medicalRecordOrError.isFailure) {
        return Result.fail<IMedicalRecordDTO>(medicalRecordOrError.errorValue());
      }

      const medicalRecordResult = medicalRecordOrError.getValue();

      const saveResult = await this.medicalRecordRepo.save(medicalRecordResult);

      if (saveResult.isFailure) {
        return Result.fail<IMedicalRecordDTO>(saveResult.errorValue());
      }

      const medicalRecordDTOResult = MedicalRecordMap.toDTOWithAllergy(medicalRecordResult) as IMedicalRecordAllergyDTO;
      return Result.ok<IMedicalRecordAllergyDTO>(medicalRecordDTOResult);
    } catch (e) {
      console.error('Error creating medical record:', e);
      return Result.fail<IMedicalRecordDTO>('Failed to create medical record');
    }
  }

  public async getMedicalRecordById(id: string): Promise<Result<IMedicalRecordDTO | IMedicalRecordAllergyDTO>> {
    try {
      const medicalRecord = await this.medicalRecordRepo.findById(id);

      if (!medicalRecord) {
        return Result.fail<IMedicalRecordAllergyDTO>('Medical record not found');
      }

      const medicalRecordDTO = MedicalRecordMap.toDTOWithAllergy(medicalRecord) as IMedicalRecordAllergyDTO;
      return Result.ok<IMedicalRecordAllergyDTO>(medicalRecordDTO);
    } catch (e) {
      console.error('Error fetching medical record:', e);
      return Result.fail<IMedicalRecordAllergyDTO>('Failed to fetch medical record');
    }
  }
  public async getMedicalRecordByUser(userId: string): Promise<Result<IMedicalRecordDTO| IMedicalRecordAllergyDTO>> {
    try {
      const medicalRecord = await this.medicalRecordRepo.findByUserId(userId);

      if (!medicalRecord) {
        return Result.fail<IMedicalRecordDTO>('Medical record not found');
      }

      const medicalRecordDTO = MedicalRecordMap.toDTOuser(medicalRecord) as IMedicalRecordAllergyDTO;
      return Result.ok<IMedicalRecordAllergyDTO>(medicalRecordDTO);
    } catch (e) {
      console.error('Error fetching medical record by user:', e);
      return Result.fail<IMedicalRecordDTO>('Failed to fetch medical record by user');
    }
  }
  public async getAllMedicalRecords(): Promise<Result<IMedicalRecordDTO[] | IMedicalRecordAllergyDTO[]>> {
    try {

      console.log("Reached Service!");

      const medicalRecords = await this.medicalRecordRepo.findAll();


      const medicalRecordDTOs = medicalRecords.map(medicalRecord => MedicalRecordMap.toDTOWithAllergy(medicalRecord) as IMedicalRecordAllergyDTO);

      console.log("Reached Service 2!");

      return Result.ok<IMedicalRecordAllergyDTO[]>(medicalRecordDTOs);
    } catch (e) {
      console.error('Error fetching all medical records:', e);
      return Result.fail<IMedicalRecordDTO[]>('Failed to fetch all medical records');
    }
  }
  public async updateMedicalConditions(userId: string, medicalConditions: string[]): Promise<Result<IMedicalRecordDTO>> {
    try {
      const medicalRecord = await this.medicalRecordRepo.findByUserId(userId);

      if (!medicalRecord) {
        return Result.fail<IMedicalRecordDTO>('Medical record not found');
      }

      let medicalConditionObjList: MedicalCondition[] = [];

      for(let i = 0; i < medicalConditions.length; i++){
        const medicalCondition = await this.medicalConditionRepo.findByCode(medicalConditions[i]);
        if (!medicalCondition) {
          return Result.fail<IMedicalRecordDTO>('Medical condition not found');
        }
        medicalConditionObjList.push(medicalCondition);
      }


      const saveResult = await this.medicalRecordRepo.updateMedicalConditions(medicalRecord, medicalConditionObjList);


      if (saveResult.isFailure) {
        return Result.fail<IMedicalRecordDTO>(saveResult.errorValue());
      }

      const medicalRecordDTO = MedicalRecordMap.touserDTO(medicalRecord) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>(medicalRecordDTO);
    } catch (e) {
      console.error('Error updating medical conditions:', e);
      return Result.fail<IMedicalRecordDTO>('Failed to update medical conditions');
    }
  }

  public async getMedicalRecordsByConditionSearch(code?: string, designation?: string): Promise<Result<IMedicalRecordAllergyDTO[]>> {
    try {
      const conditionsResult = await this.medicalConditionService.searchMedicalConditions(code, designation);

      if (conditionsResult.isFailure) {
        return Result.fail<IMedicalRecordAllergyDTO[]>(conditionsResult.errorValue());
      }

      const conditionCodes = conditionsResult.getValue().map(condition => condition.code);
      const medicalRecords = await this.medicalRecordRepo.findByConditionCodes(conditionCodes);

      const medicalRecordDTOs = medicalRecords.map(medicalRecord => {
        try {
          const formattedConditions = medicalRecord.props.medicalConditions.map(mc => 
            typeof mc === 'string' ? mc : mc.code?.value || mc
          );

          return {
            userId: medicalRecord.props.userId,
            medicalConditions: formattedConditions,
            allergies: medicalRecord.props.allergies.map(allergy => ({
              code: allergy.props.allergyId?.value || '',
              designation: allergy.props.designation?.value || '',
              description: allergy.props.description?.value || ''
            }))
          };
        } catch (error) {
          return null;
        }
      }).filter((dto): dto is IMedicalRecordAllergyDTO => dto !== null);

      return Result.ok<IMedicalRecordAllergyDTO[]>(medicalRecordDTOs);
    } catch (err) {
      return Result.fail<IMedicalRecordAllergyDTO[]>(`Error searching medical records: ${err.message}`);
    }
  }

  public async updateAllergies(userId: string, allergies: string[]): Promise<Result<IMedicalRecordDTO | IMedicalRecordAllergyDTO>> {
    try {

      console.log("Reached Service!");

      const medicalRecord = await this.medicalRecordRepo.findByUserId(userId);

      console.log("Medical Record:", medicalRecord);

      if (!medicalRecord) {
        return Result.fail<IMedicalRecordDTO>('Medical record not found');
      }
  
      const allergyArray: Allergy[] = [];
      
      console.log("for loop");
      // Create new allergy instances for each code
      for (let i = 0; i < allergies.length; i++) {

        console.log("Allergy code:", allergies[i]);
        const existingAllergy = await this.allergyRepo.findByCode(allergies[i]);
        if (!existingAllergy) {
          return Result.fail<IMedicalRecordDTO>(`Allergy with code ${allergies[i]} not found`);
        }
        
        // Create new allergy instance with same properties
        const newAllergyResult = Allergy.create({
          allergyId: existingAllergy.allergyId,
          designation: existingAllergy.designation,
          description: existingAllergy.description
        });

        console.log('New Allergy Result:', newAllergyResult);
  
        if (newAllergyResult.isFailure) {
          return Result.fail<IMedicalRecordDTO>(`Failed to create allergy instance: ${newAllergyResult.errorValue()}`);
        }
  
        allergyArray.push(newAllergyResult.getValue());
      }
  
      const saveResult = await this.medicalRecordRepo.updateAllergies(medicalRecord, allergyArray);
  
      if (saveResult.isFailure) {
        return Result.fail<IMedicalRecordDTO>(saveResult.errorValue());
      }
  
      // Use toDTOWithAllergy to include full allergy info
      const medicalRecordDTO = MedicalRecordMap.toDTOWithAllergy(medicalRecord) as IMedicalRecordAllergyDTO;
      return Result.ok<IMedicalRecordAllergyDTO>(medicalRecordDTO);
    } catch (e) {
      console.error('Error updating allergies:', e);
      return Result.fail<IMedicalRecordDTO>('Failed to update allergies');
    }
  }

  public async getMedicalRecordsByAllergySearch(code?: string, designation?: string): Promise<Result<MedicalRecord[]>> {
    try {
      const allergiesResult = await this.allergyService.searchAllergies(code, designation);

      if (allergiesResult.isFailure) {
        return Result.fail<MedicalRecord[]>(allergiesResult.errorValue());
      }

      const allergyCodes = allergiesResult.getValue().map(allergy => allergy.code);

      const medicalRecords = await this.medicalRecordRepo.findByAllergyCodes(allergyCodes);
      return Result.ok<MedicalRecord[]>(medicalRecords);
    } catch (err) {
      return Result.fail<MedicalRecord[]>(err.message);
    }
  }

  public async deleteAllergyFromMedicalRecords(userId: string, code: string): Promise<Result<void>> {
    try {

      const result = await this.medicalRecordRepo.deleteAllergyFromMedicalRecords(userId, code);

      if (result.isFailure) {
        return Result.fail<void>(result.errorValue());
      }

      return Result.ok<void>();
    } catch (e) {
      console.error('Error deleting allergy from medical records:', e);
      return Result.fail<void>('Failed to delete allergy from medical records');
    }
  }

  public async searchMedicalRecordsByAllergyAndUser(userId: string, code: string): Promise<Result<IMedicalRecordDTO | IMedicalRecordAllergyDTO>> {
    try {
  
      const medicalRecord = await this.medicalRecordRepo.findByUserId(userId);
      if (!medicalRecord) {
        return Result.fail<IMedicalRecordDTO>('Medical record not found');
      }

      
      try {
        const formattedConditions = medicalRecord.props.medicalConditions.map(mc => 
          typeof mc === 'string' ? mc : mc.code?.value || mc
        );
      
        const medicalRecordDTO: IMedicalRecordAllergyDTO = {
          userId: medicalRecord.props.userId,
          medicalConditions: formattedConditions,
          allergies: medicalRecord.props.allergies.map(allergy => ({
            code: allergy.props.allergyId?.value || '',
            designation: allergy.props.designation?.value || '',
            description: allergy.props.description?.value || ''
          }))
        };
        return Result.ok<IMedicalRecordAllergyDTO>(medicalRecordDTO);
      } catch (error) {
        return Result.fail<IMedicalRecordDTO>('Error formatting medical record data');
      }
    } catch (e) {
      console.error('Error searching medical records by allergy:', e);
      return Result.fail<IMedicalRecordDTO>('Failed to search medical records by allergy');
    }
  }
  public async updateAllergy(userId: string, allergyCode: string, designation: string, description: string): Promise<Result<IMedicalRecordDTO>> {
    try {
      const medicalRecord = await this.medicalRecordRepo.findByUserId(userId);
      if (!medicalRecord) {
        return Result.fail<IMedicalRecordDTO>('Medical record not found');
      }

      const saveResult = await this.medicalRecordRepo.updateAllergy(medicalRecord, allergyCode, designation, description);

      if (saveResult.isFailure) {
        return Result.fail<IMedicalRecordDTO>(saveResult.errorValue());
      }

      const medicalRecordDTO = MedicalRecordMap.touserDTO(medicalRecord) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>(medicalRecordDTO);
    } catch (e) {
      console.error('Error updating allergy:', e);
      return Result.fail<IMedicalRecordDTO>('Failed to update allergy');
    }
  }

  public async replaceMedicalConditions(userId: string, code: string, designation: string, description: string, commonSymptoms: string[]): Promise<Result<IMedicalRecordDTO>> {
    try {
      const medicalRecord = await this.medicalRecordRepo.findByUserId(userId);
      if (!medicalRecord) {
        return Result.fail<IMedicalRecordDTO>('Medical record not found');
      }

      const medicalCondition = await this.medicalConditionRepo.findByCode(code);
      if (!medicalCondition) {
        return Result.fail<IMedicalRecordDTO>('Medical condition not found');
      }

      const saveResult = await this.medicalRecordRepo.replaceMedicalConditions(medicalRecord, medicalCondition, designation, description, commonSymptoms);

      if (saveResult.isFailure) {
        return Result.fail<IMedicalRecordDTO>(saveResult.errorValue());
      }

      const medicalRecordDTO = MedicalRecordMap.touserDTO(medicalRecord) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>(medicalRecordDTO);
    } catch (e) {
      console.error('Error replacing medical record:', e);
      return Result.fail<IMedicalRecordDTO>('Failed to replace medical record');
    }
  }

// Methods for managing freetext entries
public async addFreeTextToMedicalRecords(userId: string, text: string): Promise<Result<IMedicalRecordAllergyDTO|IMedicalRecordDTO>> {
  try {
    const medicalRecord = await this.medicalRecordRepo.findByUserId(userId);
    if (!medicalRecord) {
      return Result.fail<IMedicalRecordDTO>('Medical record not found');
    }
    const saveResult = await this.medicalRecordRepo.addFreeTextToMedicalRecords(medicalRecord, text);
    
    const medicalRecordDTO = MedicalRecordMap.toDTOWithAllergy(medicalRecord) as IMedicalRecordAllergyDTO;
    return Result.ok<IMedicalRecordAllergyDTO>(medicalRecordDTO);
  } catch (error) {
    return Result.fail<IMedicalRecordDTO>(error.message);
  }
}

public async updateFreeTextInMedicalRecords(userId: string, text: string): Promise<Result<IMedicalRecordAllergyDTO|IMedicalRecordDTO>> {
  try {
    const medicalRecord = await this.medicalRecordRepo.findByUserId(userId);
    if (!medicalRecord) {
      return Result.fail<IMedicalRecordDTO>('Medical record not found');
    }
    const saveResult = await this.medicalRecordRepo.updateFreeTextInMedicalRecords(medicalRecord, text);

    const medicalRecordDTO = MedicalRecordMap.toDTOWithAllergy(medicalRecord) as IMedicalRecordAllergyDTO;
    return Result.ok<IMedicalRecordAllergyDTO>(medicalRecordDTO);
  } catch (error) {
    return Result.fail<IMedicalRecordDTO>(error.message);
  }
}

}