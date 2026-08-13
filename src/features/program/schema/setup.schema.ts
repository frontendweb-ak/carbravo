import { z } from "zod";

export const setupFormSchema = z
	.object({
		programName: z.string().trim().min(1, "Program name is required"),
		programNumber: z.string().trim().min(1, "Program number is required"),
		incentiveCodes: z.string().trim().min(1, "Incentive codes are required"),
		country: z.string().min(1, "Country is required"),
		deliveryStart: z.string().min(1, "Delivery start is required"),
		deliveryEnd: z.string().min(1, "Delivery end is required"),
		firstVisibleDate: z.string().min(1, "First visible date is required"),
		firstVisibleTime: z.string().optional(),
		programType: z.enum(["CUSTOMER_CASH", "APR", "BONUS_CASH"]),
		purchaseType: z.enum(["CASH", "FINANCE"]),
		mileageMaximum: z.coerce
			.number()
			.int()
			.min(0, "Mileage maximum cannot be negative"),
		conditionTier: z.enum([
			"CARBRAVO_CERTIFIED",
			"MANUFACTURER_CERTIFIED",
			"USED_INSPECTED",
			"USED_AS_IS",
		]),
		creditTiers: z
			.array(z.enum(["A_PLUS", "A1", "A2", "B"]))
			.min(1, "Select at least one credit tier"),
		contact: z.string().trim().min(1, "Contact is required"),
		flags: z.object({
			vinException: z.boolean(),
			topOfDeal: z.boolean(),
			noAddOns: z.boolean(),
		}),
	})
	.refine((data) => data.deliveryEnd >= data.deliveryStart, {
		path: ["deliveryEnd"],
		message: "Delivery end must be on or after delivery start",
	});

export type SetupFormValues = z.infer<typeof setupFormSchema>;
