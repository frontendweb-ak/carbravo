import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import {
	CoverageRules,
	GeographyTargeting,
} from "@/features/program/components/geography";

import {
	useProgramGeography,
	useUpdateProgramGeography,
} from "../hooks/use-geography";

import { geographyDefaultValues } from "../constants";

import { useEffect } from "react";
import {
	geographyFormToRequest,
	geographyResponseToForm,
} from "../model/geography.mapper";
import {
	type GeographyFormValues,
	type GeographyRule,
	geographyFormSchema,
} from "../schema";

export interface GeographyFormProps {
	programId?: number;
	revisionId?: number;
}

function createRuleId() {
	return crypto.randomUUID();
}

export function GeographyForm({ programId, revisionId }: GeographyFormProps) {
	const isEdit = programId != null && revisionId != null;
	const geographyQuery = useProgramGeography(programId, revisionId);
	const updateGeography = useUpdateProgramGeography();

	const form = useForm<GeographyFormValues>({
		resolver: zodResolver(geographyFormSchema),
		defaultValues: geographyDefaultValues,
		mode: "onBlur",
	});

	const included = useWatch({ control: form.control, name: "included" }) ?? [];
	const excluded = useWatch({ control: form.control, name: "excluded" }) ?? [];

	/*
	 * Load existing geography.
	 */
	useEffect(() => {
		if (!isEdit || !geographyQuery.data) {
			return;
		}

		form.reset(geographyResponseToForm(geographyQuery.data));
	}, [isEdit, geographyQuery.data, form]);

	const addRule = (mode: "include" | "exclude") => {
		const currentRule = form.getValues("currentRule");

		if (!currentRule.code) {
			return;
		}

		const rule: GeographyRule = {
			id: createRuleId(),
			level: currentRule.level,
			code: currentRule.code,
			name: currentRule.name,
		};

		if (mode === "include") {
			form.setValue("included", [...included, rule], {
				shouldDirty: true,
				shouldValidate: true,
			});
		} else {
			form.setValue("excluded", [...excluded, rule], {
				shouldDirty: true,
				shouldValidate: true,
			});
		}

		form.setValue("currentRule.code", "", {
			shouldDirty: true,
			shouldValidate: false,
		});

		form.setValue("currentRule.name", "", {
			shouldDirty: true,
			shouldValidate: false,
		});
	};

	const removeIncluded = (index: number) => {
		form.setValue(
			"included",
			included.filter((_, i) => i !== index),
			{
				shouldDirty: true,
				shouldValidate: true,
			},
		);
	};

	const removeExcluded = (index: number) => {
		form.setValue(
			"excluded",
			excluded.filter((_, i) => i !== index),
			{
				shouldDirty: true,
				shouldValidate: true,
			},
		);
	};

	const onSubmit = async (values: GeographyFormValues) => {
		if (programId == null || revisionId == null) {
			return;
		}

		await updateGeography.mutateAsync({
			programId,
			revisionId,
			payload: geographyFormToRequest(values),
		});

		form.reset(values);
	};

	return (
		<FormProvider {...form}>
			<Stack
				component="form"
				onSubmit={form.handleSubmit(onSubmit)}
				spacing={2.5}
			>
				<GeographyTargeting
					control={form.control}
					setValue={form.setValue}
					onAdd={addRule}
				/>

				<CoverageRules
					included={included}
					excluded={excluded}
					onRemoveInclude={removeIncluded}
					onRemoveExclude={removeExcluded}
				/>
			</Stack>
		</FormProvider>
	);
}
