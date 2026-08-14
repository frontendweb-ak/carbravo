import { Button, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import {
	CoverageRules,
	GeographyTargeting,
} from "@/features/program/components/geography";

import { geographyDefaultValues } from "../constants";

import {
	type GeographyFormValues,
	type GeographyRule,
	geographyFormSchema,
} from "../schema";

function createRuleId() {
	return crypto.randomUUID();
}

export function GeographyForm() {
	const form = useForm<GeographyFormValues>({
		resolver: zodResolver(geographyFormSchema),
		defaultValues: geographyDefaultValues,
		mode: "onBlur",
	});

	const included = useWatch({
		control: form.control,
		name: "included",
	});

	const excluded = useWatch({
		control: form.control,
		name: "excluded",
	});

	const addRule = (mode: "include" | "exclude") => {
		const currentRule = form.getValues("currentRule");

		if (!currentRule.value) {
			toast.add({
				title: "Pick a geography value to add.",
			});

			return;
		}

		const rule: GeographyRule = {
			id: createRuleId(),
			level: currentRule.level,
			value: currentRule.value,
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

		// Clear selected value after adding.
		form.setValue("currentRule.value", "", {
			shouldDirty: true,
			shouldValidate: false,
		});
	};

	const removeIncluded = (index: number) => {
		const next = included.filter((_, currentIndex) => currentIndex !== index);

		form.setValue("included", next, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const removeExcluded = (index: number) => {
		const next = excluded.filter((_, currentIndex) => currentIndex !== index);

		form.setValue("excluded", next, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

return (
	<FormProvider {...form}>
		<form className="space-y-5">
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

			<div className="flex justify-end">
				<Button type="submit">Save Geography</Button>
			</div>
		</form>
	</FormProvider>
);
}
