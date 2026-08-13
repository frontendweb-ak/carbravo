import { Button, FormSelect } from "@/components/ui";
import { type Control, type UseFormSetValue, useWatch } from "react-hook-form";
import {
	GEOGRAPHY_LEVEL_OPTIONS,
	GEOGRAPHY_VALUE_OPTIONS,
} from "../../constants/geography";
import type { GeographyFormValues, GeographyLevel } from "../../schema";

interface GeographyTargetingProps {
	control: Control<GeographyFormValues>;
	setValue: UseFormSetValue<GeographyFormValues>;

	onAdd: (mode: "include" | "exclude") => void;
}

export function GeographyTargeting({
	control,
	setValue,
	onAdd,
}: GeographyTargetingProps) {
	return (
		<section className="rounded-2xl border border-border bg-card p-6">
			<div className="mb-5">
				<h2 className="text-base font-bold text-foreground">
					Geography targeting
				</h2>

				<p className="mt-0.5 text-sm text-muted-foreground">
					Combine include and exclude rules across the hierarchy — e.g. include
					National, exclude Texas.
				</p>
			</div>

			<div className="grid items-end gap-3 lg:grid-cols-[200px_minmax(0,1fr)_auto_auto]">
				<FormSelect
					control={control}
					name="currentRule.level"
					label="Level"
					valueType="id"
					options={GEOGRAPHY_LEVEL_OPTIONS}
					getValue={(option) => option.value}
					getLabel={(option) => option.label}
				/>

				<GeographyValueSelect control={control} setValue={setValue} />

				<Button
					type="button"
					variant="outline"
					onClick={() => onAdd("include")}
					className="border-success/30 bg-success/5 text-success hover:bg-success/10"
				>
					+ Include
				</Button>

				<Button
					type="button"
					variant="outline"
					onClick={() => onAdd("exclude")}
					className="border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10"
				>
					− Exclude
				</Button>
			</div>
		</section>
	);
}
interface GeographyValueSelectProps {
	control: Control<GeographyFormValues>;
	setValue: UseFormSetValue<GeographyFormValues>;
}
export function GeographyValueSelect({ control }: GeographyValueSelectProps) {
	const level = useWatch({
		control,
		name: "currentRule.level",
	});

	const options = GEOGRAPHY_VALUE_OPTIONS[level as GeographyLevel] ?? [];

	return (
		<FormSelect
			control={control}
			name="currentRule.value"
			label="Value"
			valueType="id"
			options={options}
			getValue={(option) => option.value}
			getLabel={(option) => option.label}
		/>
	);
}
