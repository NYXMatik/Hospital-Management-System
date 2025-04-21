import { Result } from "../../core/logic/Result";
import { IAllergyDTO } from "../../dto/IAllergyDTO";
import { IAllergyUpdateDTO } from "../../dto/IAllergyDTO";

export default interface IAllergyService  {
  createAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>>;
  updateAllergy(code: string, updates: IAllergyUpdateDTO): Promise<Result<IAllergyDTO>>;
  searchAllergies(code?: string, designation?: string): Promise<Result<IAllergyDTO[]>>;
}
