import { parseDate } from "@/utils";
import { z } from "zod";

const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

export const setupFormSchema = z
	.object({
		programName: z.string().trim().min(1, "Program name is required"),
		programNumber: z.string().trim().min(1, "Program number is required"),
		incentiveCodes: z.string().trim().min(1, "Incentive codes are required"),
		country: z.string().trim().min(1, "Country is required"),
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
		programType: z.string().trim().min(1, "Program type is required"),
		purchaseType: z.string().trim().min(1, "Purchase type is required"),
		mileageMaximum: z.coerce
			.number()
			.int()
			.min(0, "Mileage maximum cannot be negative"),
		conditionTier: z.string().trim().min(1, "Condition is required"),
		creditTiers: z.array(z.string()).min(1, "Select at least one credit tier"),
		financeTerms: z.array(z.coerce.number().int()),
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

		/*
		 * Finance terms are required only for Finance.
		 */
		if (data.purchaseType === "FINANCE" && data.financeTerms.length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["financeTerms"],
				message: "Select at least one finance term",
			});
		}
	});

export type SetupFormValues = z.infer<typeof setupFormSchema>;