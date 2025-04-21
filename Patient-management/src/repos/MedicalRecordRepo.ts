import { Service, Inject } from 'typedi';
import { Document, Model } from 'mongoose';
import { IMedicalRecordPersistence } from '../dataschema/IMedicalRecordPersistence';
import { MedicalRecordMap } from "../mappers/MedicalRecordMap";
import IMedicalRecordRepo from "../services/IRepos/IMedicalRecordRepo";
import { MedicalRecord } from "../domain/MedicalRecord";
import { Result } from '../core/logic/Result';
import { MedicalCondition } from '../domain/MedicalCondition';
import { Allergy } from '../domain/Allergy';
import MedicalConditionRepo from './MedicalConditionRepo';
import AllergyRepo from './AllergyRepo';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Name } from '../domain/Name';
import { Description } from '../domain/Description';
import { raw } from 'body-parser';
import { Code } from '../domain/Code';
import { Console } from 'console';
import { AllergyMap } from "../mappers/AllergyMap";
import { cond } from 'lodash';


@Service()
export default class MedicalRecordRepo implements IMedicalRecordRepo {
  constructor(
    @Inject('medicalRecordSchema') private medicalRecordSchema: Model<IMedicalRecordPersistence & Document>,
    @Inject(() => MedicalConditionRepo) private medicalConditionRepo: MedicalConditionRepo,
    @Inject(() => AllergyRepo) private allergyRepo: AllergyRepo,
    @Inject('logger') private logger
  ) { }

  public async save(medicalRecord: MedicalRecord): Promise<Result<MedicalRecord>> {
    try {
      const rawMedicalRecord: any = MedicalRecordMap.toPersistence(medicalRecord);
      rawMedicalRecord.medicalConditions = rawMedicalRecord.medicalConditions
        .map((condition: MedicalCondition) => condition.medicalConditionId.value);

      const medicalRecordCreated = await this.medicalRecordSchema.create(rawMedicalRecord);
      return Result.ok<MedicalRecord>(await MedicalRecordMap.toDomain(medicalRecordCreated));
    } catch (err) {
      this.logger.error('Error while saving medical record:', err);
      throw new Error("Failed to save medical record.");
    }
  }

  public async findByUserId(userId: string): Promise<MedicalRecord | null> {
    const rawRecord = await this.medicalRecordSchema.findOne({ userId })
      .populate('medicalConditions')
      .exec();
    
    if (!rawRecord) {
      return null;
    }
    return MedicalRecordMap.toDomain(rawRecord);
  }

  public async findById(id: string): Promise<MedicalRecord | null> {
    const rawRecord = await this.medicalRecordSchema.findById(id)
      .populate('medicalConditions')
      .exec();
    
    if (!rawRecord) {
      return null;
    }
    return MedicalRecordMap.toDomain(rawRecord);
  }

  public async findAll(): Promise<MedicalRecord[]> {
    try {
      console.log('Finding all medical records in repo...');

      const rawRecords = await this.medicalRecordSchema.find()
        .populate('allergies')
        .populate('medicalConditions')
        .exec();
      
      const medicalRecords: MedicalRecord[] = [];
      const conditions: MedicalCondition[] = []; // Changed variable name

      for (const record of rawRecords) {
        const recordConditions: MedicalCondition[] = []; // Local array for conditions
        const allergies: Allergy[] = [];

        // Get MedicalCondition instances
        for (const condition of record.medicalConditions) { // Changed parameter name
          const medicalConditionOrError = MedicalCondition.create({
            medicalConditionId: condition.code, // Changed from medicalConditions to condition
            designation: condition.name,
            description: condition.description,
            commonSymptoms: condition.commonSymptoms || []
          });

          if (medicalConditionOrError.isSuccess) {
            recordConditions.push(medicalConditionOrError.getValue());
          }
        }

        // Convert stored allergies to domain objects
        for (const allergy of record.allergies) {
          const allergyOrError = Allergy.create({
            allergyId: allergy.code,
            designation: allergy.designation,
            description: allergy.description
          });

          if (allergyOrError.isSuccess) {
            allergies.push(allergyOrError.getValue());
          }
        }

        const medicalRecordOrError = MedicalRecord.create({
          userId: record.userId,
          medicalConditions: recordConditions, // Use local array
          allergies,
        }, new UniqueEntityID(record._id));

        if (medicalRecordOrError.isSuccess) {
          medicalRecords.push(medicalRecordOrError.getValue());
        }
      }

      return medicalRecords;
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }

  public async updateMedicalConditions(medicalRecord: MedicalRecord, newConditions: MedicalCondition[]): Promise<Result<MedicalRecord>> {
    try {
      if (!newConditions?.length) {
        return Result.fail<MedicalRecord>("No medical conditions provided for update");
      }

      const rawMedicalRecord = await this.medicalRecordSchema.findOne({ userId: medicalRecord.userId });
      if (!rawMedicalRecord) {
        return Result.fail<MedicalRecord>("Medical record not found");
      }

      // Get existing medical conditions
      const existingConditions = rawMedicalRecord.medicalConditions || [];

      // Process each new medical condition with correct schema structure
      for (const condition of newConditions) {
        if (!condition.props?.medicalConditionId) {
          return Result.fail<MedicalRecord>("Invalid medical condition data: missing conditionId");
        }

        const newConditionCode = condition.props.medicalConditionId.value;
        
        // Check if condition already exists
        const conditionExists = existingConditions.some(
          existing => existing.code === newConditionCode
        );

        console.log('Current condition:\n', condition);
        console.log('Condition code:', condition.props.medicalConditionId.value);
        console.log('Condition name:', condition.props.designation.value);
        console.log('Condition description:', condition.props.description.value);
        console.log('Condition symptoms:', condition.props.commonSymptoms.value);


        // Add only if it doesn't exist, using correct schema structure
        if (!conditionExists) {
          existingConditions.push({
            code: newConditionCode, // Changed from medicalConditionId to code
            name: condition.props.designation.value,
            description: condition.props.description.value,
            commonSymptoms: condition.props.commonSymptoms.value
          });
        }
      }

      // Update with combined list
      rawMedicalRecord.medicalConditions = existingConditions;

      console.log('Final before save Updating medical conditions:', rawMedicalRecord);

      await rawMedicalRecord.save();

      console.log('After save');

      try {
        const domainResult = await MedicalRecordMap.toDomain(rawMedicalRecord);
        console.log('Domain result:', domainResult);
        if (!domainResult) {
          return Result.fail<MedicalRecord>("Failed to map saved record to domain object");
        }
        return Result.ok<MedicalRecord>(domainResult);
      } catch (mapError) {
        return Result.fail<MedicalRecord>(`Domain mapping error: ${mapError.message}`);
      }

    

    } catch (err) {
      this.logger.error('Error while updating medical conditions:', err);
      return Result.fail<MedicalRecord>(`Failed to update medical conditions: ${err.message}`);
    }
  }

  public async findByConditionCodes(conditionCodes: string[]): Promise<MedicalRecord[]> {
    try {
      if (!conditionCodes?.length) {
        return [];
      }


      // Updated query to match current schema
      const rawRecords = await this.medicalRecordSchema
        .find({ 
          medicalConditions: { 
            $in: conditionCodes.map(code => code.trim()) 
          } 
        })
        .exec();


      if (!rawRecords || rawRecords.length === 0) {
        console.log('No records found for conditions:', conditionCodes);
        return [];
      }

      const domainRecords: MedicalRecord[] = [];

      for (const record of rawRecords) {
        try {
          const domainResult = await MedicalRecordMap.toDomain(record);
          if (domainResult) {
            domainRecords.push(domainResult);
          }
        } catch (mapError) {
          console.error('Error mapping record to domain:', mapError);
        }
      }


      return domainRecords;

    } catch (err) {
      this.logger.error('Error while finding medical records by condition codes:', err);
      throw new Error("Failed to find medical records by condition codes.");
    }
  }

  public async findByAllergyCodes(allergyCodes: string[]): Promise<MedicalRecord[]> {
    try {
      const rawRecords = await this.medicalRecordSchema.find({ 
        'allergies.code': { $in: allergyCodes } 
      }).exec();

      return Promise.all(rawRecords.map(record => MedicalRecordMap.toDomain(record)));
    } catch (err) {
      this.logger.error('Error while finding medical records by allergy codes:', err);
      throw new Error("Failed to find medical records by allergy codes.");
    }
  }
  public async updateAllergies(medicalRecord: MedicalRecord, newAllergies: Allergy[]): Promise<Result<MedicalRecord>> {
    try {
      if (!newAllergies?.length) {
        return Result.fail<MedicalRecord>("No allergies provided for update");
      }

      const rawMedicalRecord = await this.medicalRecordSchema.findOne({ userId: medicalRecord.userId });
      if (!rawMedicalRecord) {
        return Result.fail<MedicalRecord>("Medical record not found");
      }

      // Get existing allergies
      const existingAllergies = rawMedicalRecord.allergies || [];

      // Process each new allergy
      for (const allergy of newAllergies) {
        if (!allergy.props?.allergyId) {
          return Result.fail<MedicalRecord>("Invalid allergy data: missing allergyId");
        }

        const newAllergyCode = allergy.props.allergyId.value;
        
        // Check if allergy already exists
        const allergyExists = existingAllergies.some(
          existing => existing.code === newAllergyCode
        );

        // Add only if it doesn't exist
        if (!allergyExists) {
          existingAllergies.push({
            code: newAllergyCode,
            designation: allergy.props.designation.value,
            description: allergy.props.description.value
          });
        }
      }

      // Update with combined list
      rawMedicalRecord.allergies = existingAllergies;
      await rawMedicalRecord.save();

      try {
        const domainResult = await MedicalRecordMap.toDomain(rawMedicalRecord);
        if (!domainResult) {
          return Result.fail<MedicalRecord>("Failed to map saved record to domain object");
        }
        return Result.ok<MedicalRecord>(domainResult);
      } catch (mapError) {
        return Result.fail<MedicalRecord>(`Domain mapping error: ${mapError.message}`);
      }

    } catch (err) {
      this.logger.error('Error while updating allergies:', err);
      return Result.fail<MedicalRecord>(`Failed to update allergies: ${err.message}`);
    }
  }

  public async deleteAllergyFromMedicalRecords(userId: string, allergyCode: string): Promise<Result<void>> {
    try {
      const rawMedicalRecord = await this.medicalRecordSchema.findOne({ userId: userId });
      if (!rawMedicalRecord) {
        return Result.fail<void>("Medical record not found.");
      }

      rawMedicalRecord.allergies = rawMedicalRecord.allergies
        .filter((allergy: any) => allergy.code !== allergyCode);
      
      await rawMedicalRecord.save();
      return Result.ok<void>();
    } catch (err) {
      this.logger.error('Error while deleting allergy:', err);
      throw new Error("Failed to delete allergy.");
    }
  }

  public async updateAllergy(medicalRecord: MedicalRecord, allergyCode: string, designation: string, description: string): Promise<Result<MedicalRecord>> {
    try {
      const rawMedicalRecord = await this.medicalRecordSchema.findOne({ userId: medicalRecord.userId }).exec();
      if (!rawMedicalRecord) {
        return Result.fail<MedicalRecord>("Medical record not found.");
      }

      rawMedicalRecord.allergies = rawMedicalRecord.allergies.map((allergy: any) => {
        if (allergy.code === allergyCode) {
          return {
            code: allergyCode,
            designation: designation,
            description: description
          };
        }
        return allergy;
      });

      await rawMedicalRecord.save();
      return Result.ok<MedicalRecord>(await MedicalRecordMap.toDomain(rawMedicalRecord));
    } catch (err) {
      this.logger.error('Error while updating allergy:', err);
      throw new Error("Failed to update allergy.");
    }
  }

  public async replaceMedicalConditions(medicalRecord: MedicalRecord, medicalCondition: MedicalCondition, designation: string, description: string, commonSymptoms: string[]): Promise<Result<MedicalRecord>> {
    try {
      const rawMedicalRecord = await this.medicalRecordSchema.findOne({ userId: medicalRecord.userId });
      if (!rawMedicalRecord) {
        return Result.fail<MedicalRecord>("Medical record not found.");
      }

      rawMedicalRecord.medicalConditions = rawMedicalRecord.medicalConditions.map((condition: any) => {
        if (condition.code === medicalCondition.medicalConditionId.value) {
          return {
            code: medicalCondition.medicalConditionId.value,
            name: designation,
            description: description,
            commonSymptoms: commonSymptoms
          };
        }
        return condition;
      });

      await rawMedicalRecord.save();
      return Result.ok<MedicalRecord>(await MedicalRecordMap.toDomain(rawMedicalRecord));
    } catch (err) {
      this.logger.error('Error while replacing medical record:', err);
      throw new Error("Failed to replace medical record.");
    }
  }

  public async addFreeTextToMedicalRecords(medicalRecord: MedicalRecord, freeText: string): Promise<Result<MedicalRecord>> {
    try {
      const rawMedicalRecord = await this.medicalRecordSchema.findOne({ userId: medicalRecord.userId });
      if (!rawMedicalRecord) {
        return Result.fail<MedicalRecord>("Medical record not found.");
      }

      rawMedicalRecord.freeTexts = freeText;
      await rawMedicalRecord.save();
      return Result.ok<MedicalRecord>(await MedicalRecordMap.toDomain(rawMedicalRecord));
    } catch (err) {
      this.logger.error('Error while adding free text:', err);
      throw new Error("Failed to add free text.");
    }
  }

  public async updateFreeTextInMedicalRecords(medicalRecord: MedicalRecord, freeText: string): Promise<Result<MedicalRecord>> {
    try {
      const rawMedicalRecord = await this.medicalRecordSchema.findOne({ userId: medicalRecord.userId });
      if (!rawMedicalRecord) {
        return Result.fail<MedicalRecord>("Medical record not found.");
      }

      rawMedicalRecord.freeTexts = freeText;
      await rawMedicalRecord.save();
      return Result.ok<MedicalRecord>(await MedicalRecordMap.toDomain(rawMedicalRecord));
    } catch (err) {
      this.logger.error('Error while updating free text:', err);
      throw new Error("Failed to update free text.");
    }
  }

}