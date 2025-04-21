import { Result } from "../logic/Result";

export interface Repo<T> {
  //exists (t: T): Promise<boolean>;
  //save (t: T): Promise<T>;
  save(entity: T): Promise<Result<T>>;
}