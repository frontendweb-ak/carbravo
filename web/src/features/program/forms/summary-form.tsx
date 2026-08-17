import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { FormTextarea } from "@/components/ui";

import { useToast } from "@/providers/toast-provider";
import { type SummaryFormValues, summaryFormSchema } from "../schema";

const SUMMARY_MAX_LENGTH = 2000;

export function SummaryForm() {
	const toast = useToast();
	const form = useForm<SummaryFormValues>({
		resolver: zodResolver(summaryFormSchema),
		defaultValues: {
			summary: "",
		},
		mode: "onBlur",
	});

	const onSubmit = (values: SummaryFormValues) => {
		console.log("SUMMARY SUBMIT", values);

		toast.success({
			title: "Dealer summary saved.",
		});
	};

	return (
		<FormProvider {...form}>
			<Stack
				component="form"
				onSubmit={form.handleSubmit(onSubmit)}
				spacing={2}
			>
				<Card>
					<CardContent sx={{ p: 3 }}>
						<Stack spacing={2.5}>
							{/* Header */}
							<Stack spacing={0.5}>
								<Typography
									variant="h6"
									sx={{
										fontWeight: 700,
									}}
								>
									10-Point dealer summary
								</Typography>

								<Typography variant="body2" color="text.secondary">
									The plain-language summary dealers see. Describes how the
									program was authored.
								</Typography>
							</Stack>

							{/* Summary */}
							<FormTextarea
								control={form.control}
								name="summary"
								label="Summary"
								required
								placeholder="Summarize the program for dealers..."
								maxLength={SUMMARY_MAX_LENGTH}
								rows={8}
							/>
						</Stack>
					</CardContent>
				</Card>

				{/* Actions */}
				<Stack direction="row" sx={{ justifyContent: "flex-end" }}>
					<Button
						type="submit"
						variant="contained"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting ? "Saving..." : "Save Summary"}
					</Button>
				</Stack>
			</Stack>
		</FormProvider>
	);
}
