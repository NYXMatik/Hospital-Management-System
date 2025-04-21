export interface IAllergyDTO {
    code: string;
    designation: string;
    description: string;
}

export interface IAllergyUpdateDTO {
    designation?: string;
    description?: string;
}
