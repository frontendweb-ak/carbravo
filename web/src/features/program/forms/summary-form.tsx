import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { FormTextarea } from "@/components/ui";

import { useToast } from "@/providers/toast-provider";
import { ProgramSection } from "../components";
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
			<Box
				component="form"
				onSubmit={form.handleSubmit(onSubmit)}
				sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
			>
				<ProgramSection
					title="10-Point dealer summary"
					description="The plain-language summary dealers see. Describes how the
									program was authored."
				>
					<FormTextarea
						control={form.control}
						name="summary"
						label="Summary"
						required
						placeholder="Summarize the program for dealers..."
						maxLength={SUMMARY_MAX_LENGTH}
					/>
				</ProgramSection>
			</Box>
		</FormProvider>
	);
}
