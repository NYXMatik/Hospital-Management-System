import { IAllergyDTO } from "./IAllergyDTO";
import { IMedicalConditionDTO } from "./IMedicalConditionDTO";

export interface IMedicalRecordAllergyDTO {
    userId: string;
    medicalConditions: IMedicalConditionDTO[];
    allergies: IAllergyDTO[];
    freeTexts: string;
}