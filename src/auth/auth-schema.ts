import z from "zod";
export const SignupSchema = z.object({
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

export type SignupData = z.infer<typeof SignupSchema>;

export const SigninSchema = z.object({
  email: z.email().min(1).max(100),
  password: z.string().min(8),
});

export type SigninData = z.infer<typeof SigninSchema>;
