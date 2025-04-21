export interface IMedicalConditionDTO {
    code: string;
    designation: string;
    description: string;
    commonSymptoms: string[];
}

export interface IMedicalConditionUpdateDTO {
    designation?: string;
    description?: string;
}

