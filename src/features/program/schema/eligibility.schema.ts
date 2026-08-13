import { z } from "zod";

export const eligibilityFormSchema = z.object({
	financialProviderCode: z.string().min(1, "Financial provider is required."),
	tierRate: z.boolean(),
	customerTypeCodes: z
		.array(z.string())
		.min(1, "Select at least one customer type."),
	footnotes: z
		.string()
		.trim()
		.min(1, "Eligibility footnotes are required.")
		.max(2000, "Eligibility footnotes cannot exceed 2000 characters."),
});

export type EligibilityFormValues = z.infer<typeof eligibilityFormSchema>;
