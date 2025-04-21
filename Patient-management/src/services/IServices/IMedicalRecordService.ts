import { IMedicalRecordDTO } from '../../dto/IMedicalRecordDTO';
import { Result } from "../../core/logic/Result";
import { MedicalRecord } from '../../domain/MedicalRecord';
import { IMedicalRecordAllergyDTO } from '../../dto/IMedicalRecordAllergyDTO';

export default interface IMedicalRecordService {
  createMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO | IMedicalRecordAllergyDTO>>;
  getMedicalRecordById(id: string): Promise<Result<IMedicalRecordDTO | IMedicalRecordAllergyDTO>>;
  getAllMedicalRecords(): Promise<Result<IMedicalRecordDTO[] | IMedicalRecordAllergyDTO[]>>;
  getMedicalRecordByUser(userId: string): Promise<Result<IMedicalRecordAllergyDTO | IMedicalRecordDTO>>;
  updateMedicalConditions(userId: string, medicalConditions: string[]): Promise<Result<IMedicalRecordDTO>>;
  getMedicalRecordsByConditionSearch(code?: string, designation?: string): Promise<Result<IMedicalRecordAllergyDTO[]>>;
  updateAllergies(userId: string, allergies: string[]): Promise<Result<IMedicalRecordDTO | IMedicalRecordAllergyDTO>>;
  getMedicalRecordsByAllergySearch(code?: string, designation?: string): Promise<Result<MedicalRecord[]>>;
  deleteAllergyFromMedicalRecords(userId: string, allergyCode: string): Promise<Result<void>>;
  searchMedicalRecordsByAllergyAndUser(userId: string, code: string): Promise<Result<IMedicalRecordDTO | IMedicalRecordAllergyDTO>>;
  updateAllergy(userId: string, allergyCode: string, designation: string, description: string): Promise<Result<IMedicalRecordDTO>>;
  replaceMedicalConditions(userId: string, code: string, designation: string, description: string, commonSymptoms: string[]): Promise<Result<IMedicalRecordDTO>>;
  addFreeTextToMedicalRecords(userId: string, freeText: string): Promise<Result<IMedicalRecordAllergyDTO|IMedicalRecordDTO>>;
  updateFreeTextInMedicalRecords(userId: string, freeText: string): Promise<Result<IMedicalRecordAllergyDTO|IMedicalRecordDTO>>;
}