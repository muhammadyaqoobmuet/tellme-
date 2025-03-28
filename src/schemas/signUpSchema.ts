import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username should be of atleast two chars")
  .max(20, "username should be less than 20 chars")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "username must contains CAPITAL lowercase and digits and does not cotains special chars"
  );

export const signUpSchemaZod = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email adress" }),
  password: z
    .string()
    .min(6, { message: "password should be of atleast 6 digits" })
    .max(20, { message: "password should be of max 20 digits" }),
});
