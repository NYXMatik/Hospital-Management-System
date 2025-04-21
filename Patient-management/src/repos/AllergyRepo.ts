import { Service, Inject } from 'typedi';
import { Document, Model } from 'mongoose';

import { IAllergyPersistence } from '../dataschema/IAllergyPersistence';
import { AllergyMap } from "../mappers/AllergyMap";
import IAllergyRepo from "../services/IRepos/IAllergyRepo";

import { Allergy } from "../domain/Allergy";
import { Result } from '../core/logic/Result';

@Service()
export default class AllergyRepo implements IAllergyRepo {
  private models: any;

  constructor(
    @Inject('allergySchema') private allergySchema : Model<IAllergyPersistence & Document>,
    @Inject('logger') private logger
  ) { }

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async save (allergy: Allergy): Promise<Result<Allergy>> {
    
    const existingAllergy = await this.allergySchema.findOne({
      $or: [
        { code: allergy.allergyId.value },
        { designation: allergy.designation.value }
      ]
    });

    if (existingAllergy) {
      return Result.fail<Allergy>("Allergy already exists.");
    }    

    try {
      const rawAllergy: any = AllergyMap.toPersistence(allergy);
      const allergyCreated = await this.allergySchema.create(rawAllergy);
        
      const domainAllergy = await AllergyMap.toDomain(allergyCreated);
      return Result.ok<Allergy>(domainAllergy);
      
    } catch (err) {
      this.logger.error('Error while saving allergy:', err);
      throw new Error("Failed to save Allergy.");
    }
  }

  public async update(allergy: Allergy): Promise<Result<Allergy>> {
    try{
      const updatedAllergyResult = await this.allergySchema.updateOne(
        { code: allergy.allergyId.value},
        { $set: { 
          designation: allergy.designation.value.trim(), 
          description: allergy.description.value.trim() 
        } }
      );

      // Checks if update was well succeded
      if (updatedAllergyResult.modifiedCount === 0) {
        console.log("No documents were updated.");
      }
      
      const updatedAllergy = await this.findByCode(allergy.allergyId.value);      
      return Result.ok<Allergy>(updatedAllergy);

    }catch (err) {
      console.error("Error updating allergy:", err);
      return Result.fail<Allergy>('Failed to update allergy');
    }
  }

  public async findByCode(code: string): Promise<Allergy | null> {
    const document = await this.allergySchema.findOne({ code });
  
    if (!document) return null;

    return AllergyMap.toDomain(document);
  }

  public async getAllAllergies(): Promise<Allergy[]> {
    const documents = await this.allergySchema.find().exec();

    return AllergyMap.toDomainList(documents);
  }
  
  public async searchAllergies(code?: string, designation?: string): Promise<Allergy[]> {
    const query: any = {};
    if (code) query.code = { $regex: code, $options: 'i' }; // Case-insensitive search
    if (designation) query.designation = { $regex: designation, $options: 'i' }; // Case-insensitive search
  
    const documents = await this.allergySchema.find(query).exec();

    return AllergyMap.toDomainList(documents);
  }
  

  //ASIER METHOD
  public async findById(id: string): Promise<Allergy | null> {
    const rawRecord = await this.allergySchema.findById(id).exec();
    if (!rawRecord) {
      return null;
    }
    return AllergyMap.toDomain(rawRecord);
  }
}