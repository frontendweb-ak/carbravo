import { cn } from "@/utils";
import type { ReactNode } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import { Textarea, type TextareaProps } from "../primitives/textarea";
import { FormField } from "./form-field";

export type FormTextareaProps<T extends FieldValues> = Omit<
	TextareaProps,
	"name" | "value" | "defaultValue" | "onChange" | "onBlur"
> & {
	control: Control<T>;
	name: Path<T>;

	label?: ReactNode;
	required?: boolean;
	description?: ReactNode;
	rightElement?: ReactNode;

	showCounter?: boolean;
};

function FormTextarea<T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	description,
	rightElement,
	showCounter = true,
	maxLength,
	...props
}: FormTextareaProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const value = String(field.value ?? "");
				const currentLength = value.length;

				return (
					<FormField
						label={label}
						required={required}
						description={description}
						error={fieldState.error?.message}
						disabled={props.disabled}
						rightElement={rightElement}
					>
						<div className="relative">
							<Textarea
								{...props}
								{...field}
								value={value}
								maxLength={maxLength}
								error={!!fieldState.error}
								aria-invalid={fieldState.error ? true : undefined}
								className={cn(
									maxLength !== undefined && "pb-7",
									props.className,
								)}
							/>

							{showCounter && maxLength !== undefined && (
								<span
									aria-live="polite"
									className={cn(
										"pointer-events-none absolute bottom-2 right-3",
										"text-xs text-muted-foreground",
										currentLength >= maxLength && "text-destructive",
									)}
								>
									{currentLength}/{maxLength}
								</span>
							)}
						</div>
					</FormField>
				);
			}}
		/>
	);
}

export { FormTextarea };
