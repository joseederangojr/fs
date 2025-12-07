import type { Kysely } from "kysely";
import { db } from "../db";
import type { DB } from "../db/db.types";
import { default as ulid, type IdGenerator } from "../utils/ulid";
import type {
  CreateUserData,
  FindUserByEmailData,
  FindUserByIdData,
} from "./user-schema";
import { ResultAsync } from "neverthrow";
import { HTTPException } from "hono/http-exception";

export class UserNotFoundError extends HTTPException {}

export class UserService {
  constructor(
    private readonly db: Kysely<DB>,
    private readonly idGenerator: IdGenerator,
  ) {}

  findById = (data: FindUserByIdData) => {
    return ResultAsync.fromPromise(
      this.db
        .selectFrom("users")
        .selectAll()
        .where("id", "=", data.id)
        .executeTakeFirstOrThrow(),
      (err) =>
        new UserNotFoundError(404, {
          message: `User with id ${data.id} not found`,
          cause: err,
        }),
    );
  };

  findByEmail = (data: FindUserByEmailData) => {
    return ResultAsync.fromPromise(
      this.db
        .selectFrom("users")
        .selectAll()
        .where("email", "=", data.email)
        .executeTakeFirstOrThrow(),
      (err) =>
        new UserNotFoundError(404, {
          message: `User with email ${data.email} not found`,
          cause: err,
        }),
    );
  };

  create = (data: CreateUserData) => {
    return this.idGenerator.execute().andThen((id) => {
      return ResultAsync.fromPromise(
        this.db
          .insertInto("users")
          .values({
            id,
            ...data,
          })
          .returningAll()
          .executeTakeFirstOrThrow(),
         (err) => {
           return new UserNotFoundError(404, {
             message: `User with id ${id} not found`,
             cause: err,
           });
         },
      );
    });
  };
}

export const userService = new UserService(db, ulid);
