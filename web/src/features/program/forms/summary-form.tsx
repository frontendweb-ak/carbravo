import {
	Button,
	Card,
	CardContent,
	FormTextarea,
	toast,
} from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { type SummaryFormValues, summaryFormSchema } from "../schema";

const SUMMARY_MAX_LENGTH = 2000;

export function SummaryForm() {
	const form = useForm<SummaryFormValues>({
		resolver: zodResolver(summaryFormSchema),
		defaultValues: {
			summary: "",
		},
		mode: "onBlur",
	});

	// const summary =
	// 	useWatch({
	// 		control: form.control,
	// 		name: "summary",
	// 	}) ?? "";

	const onSubmit = (values: SummaryFormValues) => {
		console.log("SUMMARY SUBMIT", values);

		toast.add({
			title: "Dealer summary saved.",
		});
	};

	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<Card>
					<CardContent className="p-6">
						<div className="space-y-5">
							{/* Header */}
							<div>
								<h2 className="text-base font-bold text-foreground">
									10-Point dealer summary
								</h2>

								<p className="mt-1 text-sm text-muted-foreground">
									The plain-language summary dealers see. Describes how the
									program was authored.
								</p>
							</div>

							{/* Summary */}
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<label
										htmlFor="summary"
										className="text-xs font-bold uppercase tracking-wide text-foreground"
									>
										Summary
									</label>

									<span className="rounded bg-warning/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warning">
										Required
									</span>
								</div>

								<FormTextarea
									control={form.control}
									id="summary"
									placeholder="Summarize the program for dealers..."
									maxLength={SUMMARY_MAX_LENGTH}
									rows={8}
									aria-invalid={
										form.formState.errors.summary ? true : undefined
									}
									{...form.register("summary")}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Actions */}
				<div className="flex justify-end">
					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? "Saving..." : "Save Summary"}
					</Button>
				</div>
			</form>
		</FormProvider>
	);
}
