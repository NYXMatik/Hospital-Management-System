import { Document } from "mongodb";
import { Allergy } from "../domain/Allergy";
import { MedicalCondition } from "../domain/MedicalCondition";

export interface IMedicalRecordPersistence extends Document {
    userId: string;
    medicalConditions: MedicalCondition[];
    allergies: Allergy[];
    freeTexts: string;
  }