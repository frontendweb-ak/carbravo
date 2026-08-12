import { cn, type OptionGroupAccessors, resolveOption } from "@/utils";
import type { ComponentProps } from "react";
import { useId } from "react";

import {
	Chip,
	type ChipColor,
	type ChipRadius,
	type ChipSize,
	type ChipVariant,
} from "./chip";

export type ChipSelectionMode = "single" | "multiple";

export interface ChipGroupProps<T>
	extends Omit<ComponentProps<"div">, "onChange">, OptionGroupAccessors<T> {
	options: T[];
	value?: string | string[];
	onValueChange?: (value: string | string[]) => void;
	selectionMode?: ChipSelectionMode;
	disabled?: boolean;
	orientation?: "horizontal" | "vertical";
	color?: ChipColor;
	variant?: ChipVariant;
	radius?: ChipRadius;
	size?: ChipSize;
}

function ChipGroup<T>({
	options,
	value,
	onValueChange,

	getValue,
	getLabel,
	getDescription,
	getDisabled,

	selectionMode = "single",
	disabled = false,
	orientation = "horizontal",

	color = "default",
	variant = "outline",
	radius = "md",
	size = "md",

	className,
	...props
}: ChipGroupProps<T>) {
	const groupId = useId();

	const resolvedOptions = options.map((option) =>
		resolveOption(option, {
			getValue,
			getLabel,
			getDescription,
			getDisabled,
		}),
	);

	const selectedValues =
		selectionMode === "multiple"
			? Array.isArray(value)
				? value
				: []
			: typeof value === "string"
				? [value]
				: [];

	const handleChange = (optionValue: string) => {
		if (selectionMode === "single") {
			onValueChange?.(optionValue);
			return;
		}

		const isSelected = selectedValues.includes(optionValue);

		const nextValue = isSelected
			? selectedValues.filter((item) => item !== optionValue)
			: [...selectedValues, optionValue];

		onValueChange?.(nextValue);
	};

	return (
		<div
			{...props}
			id={props.id ?? groupId}
			data-slot="chip-group"
			data-selection-mode={selectionMode}
			data-orientation={orientation}
			className={cn(
				"flex flex-wrap gap-2",
				orientation === "vertical" && "flex-col items-start",
				className,
			)}
		>
			{resolvedOptions.map((option) => {
				const selected = selectedValues.includes(option.value);
				const isDisabled = disabled || option.disabled;

				const optionId = `${groupId}-${option.value}`;

				return (
					<Chip
						key={option.value}
						id={optionId}
						selected={selected}
						disabled={isDisabled}
						color={color}
						variant={variant}
						radius={radius}
						size={size}
						aria-pressed={selected}
						onClick={() => {
							if (!isDisabled) {
								handleChange(option.value);
							}
						}}
					>
						{option.label}
					</Chip>
				);
			})}
		</div>
	);
}

export { ChipGroup };
