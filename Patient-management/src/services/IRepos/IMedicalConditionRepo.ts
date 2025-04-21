import { Repo } from "../../core/infra/Repo";
import { MedicalCondition } from "../../domain/MedicalCondition";
import { Code } from "../../domain/Code";
import { Result } from "../../core/logic/Result";

export default interface IMedicalConditionRepo extends Repo<MedicalCondition> {
	save(medicalCondition: MedicalCondition): Promise<Result<MedicalCondition>>;
	update(medicalCondition: MedicalCondition): Promise<Result<MedicalCondition>>;

	findByCode(id: string): Promise<MedicalCondition | null>;
	
	getAllMedicalConditions(): Promise<MedicalCondition[]>;
	searchMedicalConditions(code?: string, designation?: string): Promise<MedicalCondition[]>;

	/* findAll(): Promise<MedicalCondition[]>; */
	findById(id: string): Promise<MedicalCondition | null>;
}
  