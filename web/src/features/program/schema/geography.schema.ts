import { z } from "zod";

export const geographyLevelSchema = z.enum([
	"REGION",
	"STATE",
	"COUNTRY",
	"DMA",
]);

export const geographyRuleSchema = z.object({
	id: z.string(),
	level: geographyLevelSchema,
	value: z.string().min(1),
});

export const geographyFormSchema = z
	.object({
		currentRule: z.object({ level: geographyLevelSchema, value: z.string() }),
		included: z.array(geographyRuleSchema),
		excluded: z.array(geographyRuleSchema),
	})
	// .refine((values) => values.included.length > 0, {
	// 	path: ["included"],
	// 	message: "At least one include rule is required.",
	// });

export type GeographyLevel = z.infer<typeof geographyLevelSchema>;
export type GeographyRule = z.infer<typeof geographyRuleSchema>;
export type GeographyFormValues = z.infer<typeof geographyFormSchema>;
