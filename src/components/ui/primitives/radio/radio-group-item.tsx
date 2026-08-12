import type { ReactNode } from "react";

import { cn } from "@/utils";

import { Radio } from "./radio";

export interface RadioGroupOption {
	value: string;
	label: ReactNode;
	description?: ReactNode;
	disabled?: boolean;
}

export interface RadioGroupItemProps {
	option: RadioGroupOption;
	disabled?: boolean;
}

function RadioGroupItem({ option, disabled = false }: RadioGroupItemProps) {
	const id = `radio-${option.value}`;
	const descriptionId = option.description ? `${id}-description` : undefined;

	const isDisabled = disabled || option.disabled;

	return (
		<label
			htmlFor={id}
			className={cn(
				"flex items-start gap-2",
				!isDisabled && "cursor-pointer",
				isDisabled && "cursor-not-allowed opacity-50",
			)}
		>
			<Radio
				id={id}
				value={option.value}
				disabled={isDisabled}
				aria-describedby={descriptionId}
			/>

			<div className="flex flex-col gap-0.5">
				<span className="text-sm leading-5">{option.label}</span>

				{option.description && (
					<span id={descriptionId} className="text-xs text-muted-foreground">
						{option.description}
					</span>
				)}
			</div>
		</label>
	);
}

export { RadioGroupItem };
