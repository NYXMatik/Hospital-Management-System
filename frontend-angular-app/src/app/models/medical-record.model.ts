import { Allergy } from "./allergy";
import { MedicalCondition } from "./medical-condition.model";

export interface MedicalRecord {
    userId: string;
    medicalConditions: MedicalCondition[];
    allergies: Allergy[];
    freeTexts: string;
  }