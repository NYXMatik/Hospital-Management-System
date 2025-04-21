import { Service, Inject } from 'typedi';

import { Document, Model } from 'mongoose';
import { IMedicalConditionPersistence } from '../dataschema/IMedicalConditionPersistence';
import { MedicalConditionMap } from "../mappers/MedicalConditionMap";
import IMedicalConditionRepo from "../services/IRepos/IMedicalConditionRepo";

import { MedicalCondition } from "../domain/MedicalCondition";
import { Result } from '../core/logic/Result';


@Service()
export default class MedicalConditionRepo implements IMedicalConditionRepo {
  private models: any;

  constructor(
    @Inject('medicalConditionSchema') private medicalConditionSchema : Model<IMedicalConditionPersistence & Document>,
    @Inject('logger') private logger
  ) { }

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async save(medicalCondition: MedicalCondition): Promise<Result<MedicalCondition>> {
   
    const existingMedicalCondition = await this.medicalConditionSchema.findOne({
      $or: [
        { code: medicalCondition.medicalConditionId.value },
        { designation: medicalCondition.designation.value }
      ]
    });

    if (existingMedicalCondition) {
      return Result.fail<MedicalCondition>("Medical condition already exists.");
    }

    try {
      const rawMedicalCondition: any = MedicalConditionMap.toPersistence(medicalCondition);
      const medicalConditionCreated = await this.medicalConditionSchema.create(rawMedicalCondition);

      const domainMedicalCondition = await MedicalConditionMap.toDomain(medicalConditionCreated);
      return Result.ok<MedicalCondition>(domainMedicalCondition);

    } catch (err) {
      this.logger.error('Error while saving medical condition:', err);
      throw new Error("Failed to save medical condition.");
    }
  }

  public async update(medicalCondition: MedicalCondition): Promise<Result<MedicalCondition>> {
    try{
      const updatedMedicalConditionResult = await this.medicalConditionSchema.updateOne(
        { code: medicalCondition.medicalConditionId.value},
        { $set: { 
          designation: medicalCondition.designation.value.trim(), 
          description: medicalCondition.description.value.trim() 
        } }
      );

      // Checks if update was well succeded
      if (updatedMedicalConditionResult.modifiedCount === 0) {
        console.log("No documents were updated.");
      }
      
      const updatedMedicalCondition = await this.findByCode(medicalCondition.medicalConditionId.value);      
      return Result.ok<MedicalCondition>(updatedMedicalCondition);

    }catch (err) {
      console.error("Error updating medical condition:", err);
      return Result.fail<MedicalCondition>('Failed to update medical condition');
    }
  }

  public async findByCode(code: string): Promise<MedicalCondition | null> {
    const document = await this.medicalConditionSchema.findOne({ code });
  
    if (!document) return null;

    return MedicalConditionMap.toDomain(document);
  }  

  public async getAllMedicalConditions(): Promise<MedicalCondition[]> {
    const documents = await this.medicalConditionSchema.find().exec();

    return MedicalConditionMap.toDomainList(documents);
  }
  
  public async searchMedicalConditions(code?: string, designation?: string): Promise<MedicalCondition[]> {
    const query: any = {};
    if (code) query.code = { $regex: code, $options: 'i' }; // Case-insensitive search
    if (designation) query.designation = { $regex: designation, $options: 'i' }; // Case-insensitive search
  
    const documents = await this.medicalConditionSchema.find(query).exec();

    return MedicalConditionMap.toDomainList(documents);
  }
  
  public async findById(id: string): Promise<MedicalCondition | null> {
    const rawRecord = await this.medicalConditionSchema.findById(id).exec();
    if (!rawRecord) {
      return null;
    }
    return MedicalConditionMap.toDomain(rawRecord);
  }

}