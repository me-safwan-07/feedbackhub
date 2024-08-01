import { z } from "zod";

export const verifySchema = z.object({
    code: z.string().length(8, "Verification code must be 6 digits"),
});