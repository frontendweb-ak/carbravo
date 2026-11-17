import type { ReactNode } from "react";

import type { VehicleFilterBuilderProps } from "../components/vehicle/vehicle-filter-builder";

export function VehicleFilterBuilderTestDouble({
	columns,
	disabled = false,
	editing = false,
	onCancelEdit,
	addRowLabel = "Add row",
}: VehicleFilterBuilderProps) {
	return (
		<section aria-label="Vehicle filters">
			<h2>Add Vehicles</h2>
			{columns.map((column) => {
				const selectedValues = column.value ?? [];
				const getValue = column.getValue as (option: unknown) => string;
				const getLabel = column.getLabel as (option: unknown) => ReactNode;

				return (
					<fieldset key={column.id} disabled={disabled || column.disabled}>
						<legend>{column.title}</legend>
						<button
							type="button"
							aria-pressed={selectedValues.includes("*")}
							disabled={disabled || column.disabled}
							onClick={() =>
								column.onValueChange?.(
									selectedValues.includes("*") ? [] : ["*"],
								)
							}
						>
							Any {column.title}
						</button>
						{column.options.map((option, index) => {
							const value = getValue(option);
							const label = getLabel(option);

							return (
								<button
									key={value || index}
									type="button"
									aria-pressed={selectedValues.includes(value)}
									disabled={disabled || column.disabled}
									onClick={() => {
										const nextValues = selectedValues.includes(value)
										? selectedValues.filter((item) => item !== value)
										: [...selectedValues.filter((item) => item !== "*"), value];
										column.onValueChange?.(nextValues);
									}}
								>
									{label}
								</button>
							);
						})}
					</fieldset>
				);
			})}
			{editing && onCancelEdit && (
				<button type="button" disabled={disabled} onClick={onCancelEdit}>
					Cancel Edit
				</button>
			)}
			<button type="submit" disabled={disabled}>
				{editing ? "Update Row" : addRowLabel}
			</button>
		</section>
	);
}
