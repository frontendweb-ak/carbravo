import {
	Button,
	Card,
	CardContent,
	FormInput,
	FormTextarea,
	toast,
} from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { marketingDefaultValues } from "../constants";
import { type MarketingFormValues, marketingFormSchema } from "../schema";

export function MarketingForm() {
	const form = useForm<MarketingFormValues>({
		resolver: zodResolver(marketingFormSchema),
		defaultValues: marketingDefaultValues,
		mode: "onBlur",
	});

	const onSubmit = (values: MarketingFormValues) => {
		console.log("MARKETING SUBMIT", values);

		toast.add({
			title: "Marketing details saved.",
		});
	};

	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{/* ---------------------------------------------------------------- */}
				{/* Marketing Friendly Program Name                                 */}
				{/* ---------------------------------------------------------------- */}

				<Card>
					<CardContent className="p-6">
						<div className="space-y-4">
							<div>
								<div className="flex items-center gap-2">
									<h2 className="text-base font-bold text-foreground">
										Marketing Friendly Program Name (MFPN)
									</h2>

									<span className="rounded bg-warning/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warning">
										Required
									</span>
								</div>

								<p className="mt-1 text-sm text-muted-foreground">
									Consumer-facing program name shown in marketing. Editable in
									minor revisions.
								</p>
							</div>

							<FormInput
								control={form.control}
								name="mfpnText"
								label="MFPN"
								required
								placeholder="e.g. Summer Finance Event"
							/>
						</div>
					</CardContent>
				</Card>

				{/* ---------------------------------------------------------------- */}
				{/* Disclosure                                                        */}
				{/* ---------------------------------------------------------------- */}

				<Card>
					<CardContent className="p-6">
						<div className="space-y-4">
							<div>
								<h2 className="text-base font-bold text-foreground">
									Disclosure
								</h2>

								<p className="mt-1 text-sm text-muted-foreground">
									Consumer-facing legal disclosure shown with the incentive.
									Editable in minor revisions.
								</p>
							</div>

							<FormTextarea
								control={form.control}
								name="disclosureText"
								label="Disclosure"
								required
								placeholder="Enter consumer disclosure text..."
								rows={5}
							/>
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end">
					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? "Saving..." : "Save Marketing"}
					</Button>
				</div>
			</form>
		</FormProvider>
	);
}
