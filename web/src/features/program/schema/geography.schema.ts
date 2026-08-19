import { z } from "zod";

export const geographyLevelSchema = z.enum([
	"REGION",
	"STATE",
	"DMA",
	"COUNTY",
]);

export const geographyRuleSchema = z.object({
	id: z.string(),
	level: geographyLevelSchema,
	code: z.string().min(1),
	name: z.string().min(1),
});

export const geographyCurrentRuleSchema = z.object({
	level: geographyLevelSchema,

	/**
	 * Parent selections used only while
	 * navigating the geography hierarchy.
	 */
	region: z.string(),
	state: z.string(),
	dma: z.string(),

	/**
	 * Final selected geography.
	 */
	code: z.string(),
	name: z.string(),
});

export const geographyFormSchema = z.object({
	currentRule: geographyCurrentRuleSchema,
	included: z.array(geographyRuleSchema),
	excluded: z.array(geographyRuleSchema),
});

export type GeographyLevel = z.infer<typeof geographyLevelSchema>;
export type GeographyRule = z.infer<typeof geographyRuleSchema>;
export type GeographyCurrentRule = z.infer<typeof geographyCurrentRuleSchema>;
export type GeographyFormValues = z.infer<typeof geographyFormSchema>;