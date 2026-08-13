import { z } from "zod";

const stackabilityTypeSchema = z.enum([
	"BONUS_CASH",
	"CUSTOMER_CASH",
	"APR",
	"DOWN_PAYMENT",
]);

export const incentiveValuesFormSchema = z.object({
	customerCash: z.coerce.number().min(0, "Customer Cash cannot be negative."),
	bonusCash: z.coerce.number().min(0, "Bonus Cash cannot be negative."),
	downPaymentAssist: z.coerce
		.number()
		.min(0, "Down Payment Assist cannot be negative."),
	stackableWith: z.array(stackabilityTypeSchema),
	notStackableWith: z.array(stackabilityTypeSchema),
	belongsTo: z
		.string()
		.trim()
		.max(200, "Belongs to cannot exceed 200 characters."),
});

export type IncentiveValuesFormValues = z.infer<
	typeof incentiveValuesFormSchema
>;
