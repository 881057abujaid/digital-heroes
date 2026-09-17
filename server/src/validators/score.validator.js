import { z } from "zod";

export const createScoreSchema = z.object({
    value: z
        .number()
        .int("Score must be an integer")
        .min(1, "Score must be at least 1")
        .max(45, "Score cannot exceed 45"),

    date: z
        .string()
        .date("Please provide a valid date"),
});

export const updateScoreSchema = z.object({
    value: z
        .number()
        .int("Score must be an integer")
        .min(1, "Score must be at least 1")
        .max(45, "Score cannot exceed 45"),

    date: z
        .string()
        .date("Please provide a valid date"),
});