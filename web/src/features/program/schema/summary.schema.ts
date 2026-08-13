import { z } from "zod";

export const summaryFormSchema = z.object({
	summary: z
		.string()
		.trim()
		.min(1, "Summary is required.")
		.max(2000, "Summary cannot exceed 2000 characters."),
});

export type SummaryFormValues = z.infer<typeof summaryFormSchema>;
