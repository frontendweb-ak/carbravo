import type { ComponentProps } from "react";
import { useId } from "react";

import { cn, type OptionGroupAccessors, resolveOption } from "@/utils";

import { Checkbox } from "./checkbox";

export interface CheckboxGroupProps<T>
	extends Omit<ComponentProps<"div">, "onChange">, OptionGroupAccessors<T> {
	options: T[];

	value?: string[];

	onValueChange?: (value: string[]) => void;

	disabled?: boolean;

	orientation?: "vertical" | "horizontal";
}

function CheckboxGroup<T>({
	options,
	value = [],
	onValueChange,

	getValue,
	getLabel,
	getDescription,
	getDisabled,

	disabled = false,
	orientation = "vertical",

	className,
	...props
}: CheckboxGroupProps<T>) {
	const groupId = useId();

	const handleChange = (optionValue: string, checked: boolean) => {
		const nextValue = checked
			? value.includes(optionValue)
				? value
				: [...value, optionValue]
			: value.filter((item) => item !== optionValue);

		onValueChange?.(nextValue);
	};

	return (
		<div
			data-slot="checkbox-group"
			data-orientation={orientation}
			className={cn(
				"flex",

				orientation === "vertical"
					? "flex-col gap-3"
					: "flex-row flex-wrap gap-x-6 gap-y-3",

				className,
			)}
			{...props}
		>
			{options.map((option) => {
				const resolved = resolveOption(option, {
					getValue,
					getLabel,
					getDescription,
					getDisabled,
				});

				const optionId = `${groupId}-${resolved.value}`;

				const descriptionId = resolved.description
					? `${optionId}-description`
					: undefined;

				const checked = value.includes(resolved.value);
				const isDisabled = disabled || resolved.disabled;

				return (
					<div
						key={resolved.value}
						className={cn("flex items-start gap-2", isDisabled && "opacity-50")}
					>
						<Checkbox
							id={optionId}
							checked={checked}
							disabled={isDisabled}
							aria-describedby={descriptionId}
							onCheckedChange={(checked) =>
								handleChange(resolved.value, checked === true)
							}
						/>

						<div className="flex min-w-0 flex-col gap-0.5">
							{resolved.label && (
								<label
									htmlFor={optionId}
									className={cn(
										"text-sm leading-5",
										!isDisabled && "cursor-pointer",
									)}
								>
									{resolved.label}
								</label>
							)}

							{resolved.description && (
								<p id={descriptionId} className="text-xs text-muted-foreground">
									{resolved.description}
								</p>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}

export { CheckboxGroup };
