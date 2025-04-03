import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username should be at least two characters")
  .max(20, "Username should be less than 20 characters")
  .superRefine((val, ctx) => {
    const trimmedVal = val.trim(); // Trim spaces

    // Check if trimmed value has spaces or invalid characters
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedVal)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Username must contain only letters, numbers, and underscores (no special characters or spaces)",
      });
    }
  });

export const signUpSchemaZod = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email adress" }),
  password: z
    .string()
    .min(6, { message: "password should be of atleast 6 digits" })
    .max(20, { message: "password should be of max 20 digits" }),
});
