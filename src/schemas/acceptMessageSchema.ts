import {z} from "zod"


export const acceptMessageSchemaZod = z.object({
    acceptMessages:z.boolean()
})