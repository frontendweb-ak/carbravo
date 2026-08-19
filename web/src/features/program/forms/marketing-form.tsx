import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { FormInput, FormTextarea } from "@/components/ui/forms";

import { ProgramSection } from "../components";
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
	};

	return (
		<FormProvider {...form}>
			<Box
				component="form"
				onSubmit={form.handleSubmit(onSubmit)}
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 2.5,
				}}
			>
				<ProgramSection
					title="Marketing Friendly Program Name (MFPN)"
					description="Consumer-facing program name shown in marketing. Editable in
									minor revisions."
				>
					<FormInput
						control={form.control}
						name="mfpnText"
						label="MFPN"
						required
						placeholder="e.g. Summer Finance Event"
					/>
				</ProgramSection>
				
				<ProgramSection
					title="Disclosure"
					description="Consumer-facing legal disclosure shown with the incentive.
									Editable in minor revisions."
				>
					<FormTextarea
						control={form.control}
						name="disclosureText"
						label=""
						required
						placeholder="Enter consumer disclosure text..."
					/>
				</ProgramSection>
			</Box>
		</FormProvider>
	);
}
