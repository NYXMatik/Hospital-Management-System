
import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface NameProps {
  value: string;
}

export class Name extends ValueObject<NameProps> {
  get value (): string {
    return this.props.value;
  }
  
  private constructor (props: NameProps) {
    super(props);
  }

  public static create(name: string): Result<Name> {
    const guardResult = Guard.againstNullOrUndefined(name, 'name');
    if (!guardResult.succeeded) {
      return Result.fail<Name>(guardResult.message);
    }

    if (name.trim().length === 0) {
      return Result.fail<Name>("Designation cannot be empty or just whitespace.");
    }

    const regex = /^(?=.*[A-Za-zÀ-ÖØ-öø-ÿ])[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-\(\)]+$/;
    if (!regex.test(name)) {
      return Result.fail<Name>(
        "Designation must contain at least one letter and may include alphanumeric characters (letters, numbers), spaces, hyphens (-), and parentheses."
      );
    }

    if (name.length < 5 || name.length > 50) {
      return Result.fail<Name>("Designation must be between 5 and 50 characters.");
    }    
  
    return Result.ok<Name>(new Name({ value: name }));
  }
  
}