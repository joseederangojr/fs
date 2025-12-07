import z from "zod";
export const CreateUserSchema = z.object({
  email: z.email().min(1).max(100),
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    ),
});

export type CreateUserData = z.infer<typeof CreateUserSchema>;

export const FindUserByEmailSchema = z.object({
  email: z.email().min(1).max(100),
});

export type FindUserByEmailData = z.infer<typeof FindUserByEmailSchema>;

export const FindUserByIdSchema = z.object({
  id: z.string().length(26),
});

export type FindUserByIdData = z.infer<typeof FindUserByIdSchema>;
