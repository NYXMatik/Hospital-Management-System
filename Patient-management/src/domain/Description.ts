
import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface DescriptionProps {
  value: string;
}

export class Description extends ValueObject<DescriptionProps> {
  get value (): string {
    return this.props.value;
  }
  
  private constructor (props: DescriptionProps) {
    super(props);
  }

  public static create (description: string | null): Result<Description> {

    // Ensure the input is a string
    if (typeof description !== "string" && description !== null) {
      return Result.fail<Description>('Description must be a string or empty.');
    }

    // If the description is null or empty, it is valid (optional field)
    if (description === null || description === '') {
      return Result.ok<Description>(new Description({ value: "" })); // Accept as empty string
    }
  
    // If the description is provided, check that it does not contain only whitespace
    if (description.trim().length === 0) {
      return Result.fail<Description>('Description cannot be just whitespace.');
    }

    if (/^\d+$/.test(description.trim())) {
      return Result.fail<Description>('Description cannot contain only numbers.');
    }

    return Result.ok<Description>(new Description({ value: description }));
  }
}