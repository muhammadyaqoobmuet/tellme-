import { z } from "zod";

export const messageSchemaZod = z.object({
  content: z
    .string()
    .min(10, { message: "message should be of atleast 1 char" })
    .max(400, { message: "message should be of max 400 chars" }),
});
