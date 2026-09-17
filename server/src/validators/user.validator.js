import { z } from "zod";

export const updateCharitySchema = z.object({
    charityId: z
        .string()
        .min(1, "Charity ID is required"),

    charityPercentage: z
        .number()
        .min(10, "Charity contribution must be at least 10%")
        .max(100, "Charity contribution cannot exceed 100"),
});