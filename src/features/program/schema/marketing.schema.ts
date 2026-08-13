import { z } from "zod";

export const marketingFormSchema = z.object({
	mfpnText: z
		.string()
		.trim()
		.min(1, "Marketing friendly program name is required.")
		.max(
			200,
			"Marketing friendly program name must be 200 characters or less.",
		),

	disclosureText: z
		.string()
		.trim()
		.min(1, "Disclosure is required.")
		.max(5000, "Disclosure must be 5000 characters or less."),
});

export type MarketingFormValues = z.infer<typeof marketingFormSchema>;
