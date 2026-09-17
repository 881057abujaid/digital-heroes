import { z } from "zod";

export const simulateDrawSchema = z.object({
    drawDate: z.coerce.date(),

    mode: z.enum(["RANDOM", "ALGORITHMIC"]),
});