import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import {
	useCreateProgram,
	useProgramSetup,
	useUpdateProgramSetup,
} from "../hooks";
import { setupDefaultValues } from "../constants";
import { useProgramEditor } from "../editor/program-editor-context";
import { setupFormSchema } from "../schema";
import {
	ControllingDatesSection,
	ProgramConfigurationSection,
	ProgramDetailsSection,
	ProgramFlagsSection,
} from "./setup-form-sections";
import type { SetupFormInput, SetupFormOutput } from "./setup-form.types";
import { useSetupFormPersistence } from "./use-setup-form-persistence";

interface SetupFormProps {
	mode: "new" | "edit";
	programId?: number;
	revisionId?: number;
	readOnly?: boolean;
	onCreated?: (result: { programId: number; revisionId: number }) => void;
}

export function SetupForm({
	mode,
	programId,
	revisionId,
	readOnly = false,
	onCreated,
}: SetupFormProps) {
	const { registerSaveHandler, updateSectionStatus, setSaveStatus, isMinorRevision } =
		useProgramEditor();
	const isExistingRevision =
		mode === "edit" && programId != null && revisionId != null;
	const canEdit =
		mode === "new" || (isExistingRevision && !readOnly && !isMinorRevision);

	const {
		data: setup,
		isLoading: isSetupLoading,
		isError: isSetupError,
		refetch: refetchSetup,
	} = useProgramSetup(programId, revisionId);
	const { mutateAsync: createProgramAsync } = useCreateProgram();
	const { mutateAsync: updateSetupAsync } = useUpdateProgramSetup();

	const form = useForm<SetupFormInput, unknown, SetupFormOutput>({
		resolver: zodResolver(setupFormSchema),
		defaultValues: setupDefaultValues,
		mode: "onBlur",
		reValidateMode: "onBlur",
	});
	const purchaseType = useWatch({
		control: form.control,
		name: "purchaseType",
	});

	useSetupFormPersistence({
		mode,
		programId,
		revisionId,
		isExistingRevision,
		canEdit,
		setup,
		form,
		createProgram: createProgramAsync,
		updateSetup: updateSetupAsync,
		onCreated,
		updateSectionStatus,
		registerSaveHandler,
		setSaveStatus,
	});

	useEffect(() => {
		if (purchaseType === "FINANCE") return;

		const currentTerms = form.getValues("financeTerms");
		if (currentTerms.length === 0) return;

		form.setValue("financeTerms", [], {
			shouldDirty: true,
			shouldTouch: false,
			shouldValidate: false,
		});
	}, [purchaseType, form]);

	/* ---------------------------------------------------------------------- */
	/* Loading                                                                  */
	/* ---------------------------------------------------------------------- */

	if (isExistingRevision && isSetupLoading) {
		return (
			<Box
				sx={{
					border: 1,
					borderColor: "divider",
					borderRadius: 3,
					bgcolor: "background.paper",
					p: 3,
				}}
			>
				<Typography variant="body2" color="text.secondary">
					Loading setup...
				</Typography>
			</Box>
		);
	}

	/* ---------------------------------------------------------------------- */
	/* Error                                                                    */
	/* ---------------------------------------------------------------------- */

	if (isExistingRevision && isSetupError) {
		return (
			<Alert
				severity="error"
				variant="outlined"
				action={
					<Button
						size="small"
						color="inherit"
						onClick={() => {
							void refetchSetup();
						}}
					>
						Retry
					</Button>
				}
				sx={{ alignItems: "center" }}
			>
				<Stack spacing={0.5}>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						Failed to load setup
					</Typography>

					<Typography variant="body2">
						We couldn't load this revision's setup data.
					</Typography>
				</Stack>
			</Alert>
		);
	}

	return (
		<FormProvider {...form}>
			<Stack
				component="form"
				spacing={4}
				noValidate
				onSubmit={(event) => event.preventDefault()}
			>
				<ProgramDetailsSection control={form.control} canEdit={canEdit} />
				<ControllingDatesSection control={form.control} canEdit={canEdit} />
				<ProgramConfigurationSection
					control={form.control}
					canEdit={canEdit}
					purchaseType={purchaseType}
				/>
				<ProgramFlagsSection control={form.control} canEdit={canEdit} />
			</Stack>
		</FormProvider>
	);
}
