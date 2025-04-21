import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { Code } from "./Code";
import { Name } from "./Name";
import { Description } from "./Description";


interface AllergyProps {
  allergyId: Code;
  designation: Name;
  description: Description;
}

export class Allergy extends AggregateRoot<AllergyProps> {
  get id (): UniqueEntityID {
    return this._id;
  }

  get allergyId (): Code {
    return this.props.allergyId;
  }

  get designation  (): Name {
    return this.props.designation 
  }

  get description (): Description {
    return this.props.description;
  }

  private constructor (props: AllergyProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create (props: AllergyProps, id?: UniqueEntityID): Result<Allergy> {

    const guardedProps = [
      { argument: props.allergyId, argumentName: 'code' },
      { argument: props.designation , argumentName: 'designation ' },
      { argument: props.description, argumentName: 'description' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Allergy>(guardResult.message)
    }     
    else {
      const allergy = new Allergy({
        ...props
      }, id);

      return Result.ok<Allergy>(allergy);
    }
  }
}