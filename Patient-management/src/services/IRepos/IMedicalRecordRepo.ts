import { MedicalRecord } from "../../domain/MedicalRecord";
import { Result } from '../../core/logic/Result';
import { Allergy } from "../../domain/Allergy";
import { MedicalCondition } from "../../domain/MedicalCondition";

export default interface IMedicalRecordRepo {
  save(medicalRecord: MedicalRecord): Promise<Result<MedicalRecord>>;
  findById(id: string): Promise<MedicalRecord | null>;
  findAll(): Promise<MedicalRecord[]>;
  findByUserId(userId: string): Promise<MedicalRecord | null>;
  updateMedicalConditions(medicalRecord: MedicalRecord, newMedicalConditions: MedicalCondition[]): Promise<Result<MedicalRecord>>;
  findByConditionCodes(conditionCodes: string[]): Promise<MedicalRecord[]>;
  findByAllergyCodes(codes: string[]): Promise<MedicalRecord[]>;
  updateAllergies(medicalRecord: MedicalRecord, newAllergies: Allergy[]): Promise<Result<MedicalRecord>>;
  deleteAllergyFromMedicalRecords(userId: string, allergyCode: string): Promise<Result<void>>;
  updateAllergy(medicalRecord: MedicalRecord, allergyCode: string, designation: string, description: string): Promise<Result<MedicalRecord>>;
  replaceMedicalConditions(medicalRecord: MedicalRecord, medicalCondition: MedicalCondition, designation: string, description: string, commonSymptoms: string[]): Promise<Result<MedicalRecord>>;
  addFreeTextToMedicalRecords(medicalRecord: MedicalRecord, freeText: string): Promise<Result<MedicalRecord>>;
  updateFreeTextInMedicalRecords(medicalRecord: MedicalRecord, freeText: string): Promise<Result<MedicalRecord>>;
}