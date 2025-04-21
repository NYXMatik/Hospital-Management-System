export interface IMedicalConditionPersistence {
    medicalConditionId: string;
    name: string;
    description?: string;
    commonSymptoms: string[];
  }