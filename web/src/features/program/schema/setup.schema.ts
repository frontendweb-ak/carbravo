import { parseDate } from "@/utils";
import { z } from "zod";

const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

export const setupFormSchema = z
	.object({
		programName: z.string().trim().min(1, "Program name is required"),

		programNumber: z.string().trim().min(1, "Program number is required"),

		incentiveCodes: z.string().trim().min(1, "Incentive codes are required"),

		country: z.string().min(1, "Country is required"),

		deliveryStart: z
			.string()
			.min(1, "Delivery start is required")
			.regex(dateRegex, "Date must be DD-MM-YYYY"),

		deliveryEnd: z
			.string()
			.min(1, "Delivery end is required")
			.regex(dateRegex, "Date must be DD-MM-YYYY"),

		firstVisibleDate: z
			.string()
			.min(1, "First visible date is required")
			.regex(dateRegex, "Date must be DD-MM-YYYY"),

		firstVisibleTime: z.string().optional(),

		programType: z.enum(["CUSTOMER_CASH", "APR", "BONUS_CASH"]),

		purchaseType: z.enum(["NEW", "USED"]),

		mileageMaximum: z.coerce
			.number()
			.int()
			.min(0, "Mileage maximum cannot be negative"),

		conditionTier: z.enum(["ANY", "NEW", "USED"]),

		creditTiers: z
			.array(z.enum(["ANY", "A", "B", "C", "D", "E"]))
			.min(1, "Select at least one credit tier"),

		contact: z.string().trim().min(1, "Contact is required"),

		flags: z.object({
			vinException: z.boolean(),
			topOfDeal: z.boolean(),
			noAddOns: z.boolean(),
		}),
	})
	.superRefine((data, ctx) => {
		if (
			dateRegex.test(data.deliveryStart) &&
			dateRegex.test(data.deliveryEnd)
		) {
			const start = parseDate(data.deliveryStart);
			const end = parseDate(data.deliveryEnd);

			if (end < start) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ["deliveryEnd"],
					message: "Delivery end must be on or after delivery start",
				});
			}
		}
	});

export type SetupFormValues = z.infer<typeof setupFormSchema>;
