import { Repo } from "../../core/infra/Repo";
import { Result } from "../../core/logic/Result";
import { Allergy } from "../../domain/Allergy";

export default interface IAllergyRepo extends Repo<Allergy> {
	save(allergy: Allergy): Promise<Result<Allergy>>;
	update(allergy: Allergy): Promise<Result<Allergy>>;
	findByCode(id: string): Promise<Allergy | null>;
	getAllAllergies(): Promise<Allergy[]>;
	searchAllergies(code?: string, designation?: string): Promise<Allergy[]>;

	findById(id: string): Promise<Allergy | null>;
}
  