import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface CommonSymptomsProps {
  value: string[];
}

export class CommonSymptoms extends ValueObject<CommonSymptomsProps> {
  get value(): string[] {
    return this.props.value;
  }

  private constructor(props: CommonSymptomsProps) {
    super(props);
  }

  public static create(symptoms: string[]): Result<CommonSymptoms> {
   
    const guardResult = Guard.againstNullOrUndefined(symptoms, "commonSymptoms");
    if (!guardResult.succeeded) {
      return Result.fail<CommonSymptoms>(guardResult.message);
    }

    if (symptoms.length === 0) {
      return Result.fail<CommonSymptoms>("A medical condition must have at least one common symptom.");
    }

    for (const symptom of symptoms) {
      if (symptom.trim().length === 0) {
        return Result.fail<CommonSymptoms>("Symptoms cannot be empty or just whitespace.");
      }
    }

    return Result.ok<CommonSymptoms>(new CommonSymptoms({ value: symptoms }));
  }
}
