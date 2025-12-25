import { z } from "zod";

export const signInSchemaZod = z.object({
  identifier: z.string(),
  password: z
    .string()
    .min(6, { message: "password should be of atleast 6 digits" }),
});
