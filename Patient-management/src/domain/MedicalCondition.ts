import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { Code } from "./Code";
import { Name } from "./Name";
import { Description } from "./Description";
import { CommonSymptoms } from "./CommonSymptoms";

interface MedicalConditionProps {
  medicalConditionId: Code;
  designation: Name;
  description: Description;
  commonSymptoms: CommonSymptoms;
}

export class MedicalCondition extends AggregateRoot<MedicalConditionProps> {
  code: any;
  get id (): UniqueEntityID {
    return this._id;
  }

  get medicalConditionId (): Code {
    return this.props.medicalConditionId;
  }

  get designation (): Name {
    return this.props.designation;
  }

  get description (): Description {
    return this.props.description;
  }

  get commonSymptoms(): CommonSymptoms {
    return this.props.commonSymptoms;
  }

  private constructor (props: MedicalConditionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create (props: MedicalConditionProps, id?: UniqueEntityID): Result<MedicalCondition> {

    const guardedProps = [
      { argument: props.medicalConditionId, argumentName: 'code' },
      { argument: props.designation, argumentName: 'designation' },
      { argument: props.description, argumentName: 'description' },
      { argument: props.commonSymptoms, argumentName: "commonSymptoms" },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<MedicalCondition>(guardResult.message)
    }     
    else {
      const medicalCondition = new MedicalCondition({
        ...props
      }, id);

      return Result.ok<MedicalCondition>(medicalCondition);
    }
  }
}