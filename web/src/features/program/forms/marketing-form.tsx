import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { FormInput, FormTextarea } from "@/components/ui/forms";

import { marketingDefaultValues } from "../constants";
import { type MarketingFormValues, marketingFormSchema } from "../schema";

const REQUIRED_LABEL = {
	display: "inline-flex",
	alignItems: "center",
	marginLeft: 8,
	padding: "2px 6px",
	borderRadius: 4,
	fontSize: 10,
	fontWeight: 700,
	lineHeight: 1,
	letterSpacing: "0.05em",
	textTransform: "uppercase",
	backgroundColor: "warning.main",
	color: "warning.contrastText",
};

export function MarketingForm() {
	const form = useForm<MarketingFormValues>({
		resolver: zodResolver(marketingFormSchema),
		defaultValues: marketingDefaultValues,
		mode: "onBlur",
	});

	const onSubmit = (values: MarketingFormValues) => {
		console.log("MARKETING SUBMIT", values);
	};

	const isSubmitting = form.formState.isSubmitting;

	return (
		<FormProvider {...form}>
			<Stack
				component="form"
				onSubmit={form.handleSubmit(onSubmit)}
				spacing={2}
			>
				{/* ---------------------------------------------------------------- */}
				{/* Marketing Friendly Program Name                                 */}
				{/* ---------------------------------------------------------------- */}

				<Card variant="outlined">
					<CardContent sx={{ p: 3 }}>
						<Stack spacing={2}>
							<Stack spacing={0.5}>
								<Typography
									variant="h6"
									sx={{
										display: "flex",
										alignItems: "center",
										fontWeight: 700,
									}}
								>
									Marketing Friendly Program Name (MFPN)
									<Typography component="span" sx={REQUIRED_LABEL}>
										Required
									</Typography>
								</Typography>

								<Typography variant="body2" color="text.secondary">
									Consumer-facing program name shown in marketing. Editable in
									minor revisions.
								</Typography>
							</Stack>

							<FormInput
								control={form.control}
								name="mfpnText"
								label="MFPN"
								required
								placeholder="e.g. Summer Finance Event"
							/>
						</Stack>
					</CardContent>
				</Card>

				{/* ---------------------------------------------------------------- */}
				{/* Disclosure                                                        */}
				{/* ---------------------------------------------------------------- */}

				<Card variant="outlined">
					<CardContent sx={{ p: 3 }}>
						<Stack spacing={2}>
							<Stack spacing={0.5}>
								<Typography variant="h6" sx={{ fontWeight: 700 }}>
									Disclosure
								</Typography>

								<Typography variant="body2" color="text.secondary">
									Consumer-facing legal disclosure shown with the incentive.
									Editable in minor revisions.
								</Typography>
							</Stack>

							<FormTextarea
								control={form.control}
								name="disclosureText"
								label="Disclosure"
								required
								placeholder="Enter consumer disclosure text..."
								rows={5}
							/>
						</Stack>
					</CardContent>
				</Card>

				{/* ---------------------------------------------------------------- */}
				{/* Actions                                                           */}
				{/* ---------------------------------------------------------------- */}

				<Stack direction="row" sx={{ justifyContent: "flex-end" }}>
					<Button type="submit" variant="contained" disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : "Save Marketing"}
					</Button>
				</Stack>
			</Stack>
		</FormProvider>
	);
}
