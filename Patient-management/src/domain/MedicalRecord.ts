import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { Allergy } from "./Allergy";
import { MedicalCondition } from "./MedicalCondition";

interface MedicalRecordProps {
  userId: string;
  medicalConditions: MedicalCondition[];
  allergies: Allergy[];
  freeTexts: string;
}

export class MedicalRecord extends AggregateRoot<MedicalRecordProps> {
  addFreeTextToMedicalRecords(text: string) {
    throw new Error('Method not implemented.');
  }
  updateFreeTextInMedicalRecords(text: string) {
    throw new Error('Method not implemented.');
  }
  get id (): UniqueEntityID {
    return this._id;
  }

  get userId (): string {
    return this.props.userId;
  }

  get medicalConditions (): MedicalCondition[] {
    return this.props.medicalConditions;
  }

  get allergies (): Allergy[] {
    return this.props.allergies;
  }

  get freeTexts (): string {
    return this.props.freeTexts;
  }

  private constructor (props: MedicalRecordProps, id?: UniqueEntityID) {
    super(props, id ? id : new UniqueEntityID());
  }

  public static create (props: MedicalRecordProps, id?: UniqueEntityID): Result<MedicalRecord> {

    const guardedProps = [
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.medicalConditions, argumentName: 'medicalConditions' },
      { argument: props.allergies, argumentName: 'allergies' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<MedicalRecord>(guardResult.message)
    }     
    else {
      const medicalRecord = new MedicalRecord({
        ...props
      }, id);

      return Result.ok<MedicalRecord>(medicalRecord);
    }
  }
  
}