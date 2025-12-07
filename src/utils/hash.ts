import Bcrypt from "bcrypt";
import { default as config, type ConfigData } from "./config";
import { ResultAsync } from "neverthrow";
import { HTTPException } from "hono/http-exception";

export interface Hasher {
  hash(password: string): ResultAsync<string, HashGenerateError>;
  verify(plain: string, hashed: string): ResultAsync<boolean, HashVerifyError>;
}

export class HashGenerateError extends HTTPException {}
export class HashVerifyError extends HTTPException {}

export class BcryptHasher implements Hasher {
  constructor(
    private readonly bcrypt: typeof Bcrypt,
    private readonly config: ConfigData,
  ) {}

  hash(password: string) {
    return ResultAsync.fromPromise(
      this.bcrypt.genSalt(this.config.HASH_ROUNDS),
      (err) =>
        new HashGenerateError(500, {
          message: "Failed to generate password hash salt",
          cause: err,
        }),
    ).andThen((salt: string) => {
      return ResultAsync.fromPromise(
        this.bcrypt.hash(password, salt),
        (err) =>
          new HashGenerateError(500, {
            message: "Failed to generate password hash",
            cause: err,
          }),
      );
    });
  }

  verify(plain: string, hashed: string) {
    return ResultAsync.fromPromise(
      this.bcrypt.compare(plain, hashed),
      (err) =>
        new HashVerifyError(500, {
          message: "Failed to verify password hash",
          cause: err,
        }),
    );
  }
}

export default new BcryptHasher(Bcrypt, config);
