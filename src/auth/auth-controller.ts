import {
  UserNotFoundError,
  userService,
  type UserService,
} from "../user/user-service";
import { default as hasher, type Hasher } from "../utils/hash";
import type { ConfigData } from "../utils/config";
import config from "../utils/config";
import { SignupSchema, type SigninData, type SignupData } from "./auth-schema";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import * as honoJwt from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { FindUserByIdSchema, type FindUserByIdData } from "../user/user-schema";
import { safeParseAsync } from "../utils/zod";
import { addSecondsToDate, dateToSeconds } from "../utils/date";

export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly hasher: Hasher,
    private readonly config: ConfigData,
    private readonly jwt: typeof honoJwt,
  ) {}

  async signin(data: SigninData) {
    const expiresIn = Math.floor(
      dateToSeconds(addSecondsToDate(this.config.JWT_EXPIRY)),
    );
    return safeParseAsync(SignupSchema, data)
      .andThen(this.userService.findByEmail)
      .andThen((user) => {
        return ResultAsync.combine([
          ResultAsync.fromSafePromise(Promise.resolve(user)),
          this.hasher.verify(data.password, user.password),
        ]);
      })
      .andThen(([user, verified]) => {
        if (!verified) {
          return errAsync(
            new HTTPException(422, {
              message: "Invalid email or password",
              res: new Response(
                JSON.stringify({
                  email: ["Invalid email or password"],
                }),
                {
                  status: 422,
                  headers: {
                    "Content-Type": "application/json",
                  },
                },
              ),
            }),
          );
        }

        return ResultAsync.fromPromise(
          this.jwt.sign(
            {
              sub: user.id,
              iss: this.config.APP_URL,
              aud: this.config.APP_URL,
              exp: expiresIn,
            },
            this.config.JWT_SECRET,
            this.config.JWT_ALG,
          ),
          (err) =>
            new HTTPException(500, {
              cause: err,
            }),
        );
      })
      .andThen((accessToken) => {
        return okAsync({
          expiresIn: expiresIn,
          accessToken: accessToken,
          tokenType: "Bearer",
        });
      });
  }

  async signup(data: SignupData) {
    return safeParseAsync(SignupSchema, data)
      .andThen((user) => {
        return this.userService
          .findByEmail(user)
          .andThen((_) => {
            return errAsync(
              new HTTPException(422, {
                message: "Email already taken",
                res: new Response(
                  JSON.stringify({
                    email: ["Email already taken"],
                  }),
                  {
                    status: 422,
                  },
                ),
              }),
            );
          })

          .orElse((err) => {
            if (err instanceof UserNotFoundError) {
              return okAsync(user);
            }
            return errAsync(err);
          });
      })
      .andThen((data) => {
        return ResultAsync.combine([
          ResultAsync.fromSafePromise(Promise.resolve(data)),
          this.hasher.hash(data.password),
        ]);
      })
      .andThen(([data, hashPassword]) => {
        return this.userService.create({
          email: data.email,
          password: hashPassword,
        });
      });
  }

  async me(data: FindUserByIdData) {
    return safeParseAsync(FindUserByIdSchema, data).andThen(
      this.userService.findById,
    );
  }
}

export default new AuthController(userService, hasher, config, honoJwt);
