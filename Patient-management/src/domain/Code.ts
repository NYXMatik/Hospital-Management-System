
import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface CodeProps {
  value: string;
}

export class Code extends ValueObject<CodeProps> {
  get value (): string {
    return this.props.value;
  }
  
  private constructor (props: CodeProps) {
    super(props);
  }

  public static create(code: string): Result<Code> {
    const guardResult = Guard.againstNullOrUndefined(code, 'code');
    if (!guardResult.succeeded) {
      return Result.fail<Code>(guardResult.message);
    }
  
    if (code.trim().length === 0) {
      return Result.fail<Code>("Code cannot be empty or just whitespace.");
    }
  
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\-_.: ]+$/;
    if (!regex.test(code)) {
      return Result.fail<Code>(
        "Code must only contain alphanumeric characters (letters, numbers), spaces, and the following special characters: -, _, ., :."
      );
    }
    return Result.ok<Code>(new Code({ value: code }));

  }
  

}