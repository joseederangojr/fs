import { ResultAsync } from "neverthrow";
import * as Ulid from "ulid";

export interface IdGenerator {
  execute(): ResultAsync<string, never>;
}

export class UlidIdGenerator implements IdGenerator {
  constructor(private readonly ulid: typeof Ulid) {}
  execute() {
    return ResultAsync.fromSafePromise(Promise.resolve(this.ulid.ulid()));
  }
}

export default new UlidIdGenerator(Ulid);
