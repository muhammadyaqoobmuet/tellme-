import { z } from "zod";

export const verifySchemaZod = z.object({
  code: z.string().length(6, { message: "code of should be 6 numbers" }),
});
