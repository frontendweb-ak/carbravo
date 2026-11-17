import type { ReactNode } from "react";
import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
} from "react-hook-form";

type FieldProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	label?: ReactNode;
	disabled?: boolean;
	type?: string;
	options?: readonly { value: string | number; label: ReactNode }[];
};

function TextControl<T extends FieldValues>({
	control,
	name,
	label,
	disabled = false,
	type = "text",
}: FieldProps<T>) {
	const id = String(name);

	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<label htmlFor={id}>
					{label ?? id}
					<input
						{...field}
						id={id}
						type={type}
						disabled={disabled}
						value={field.value ?? ""}
					/>
				</label>
			)}
		/>
	);
}

function CheckboxControl<T extends FieldValues>({
	control,
	name,
	label,
	disabled = false,
}: FieldProps<T>) {
	const id = String(name);

	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<label htmlFor={id}>
					{label ?? id}
					<input
						id={id}
						name={field.name}
						type="checkbox"
						checked={Boolean(field.value)}
						disabled={disabled}
						onBlur={field.onBlur}
						onChange={(event) => field.onChange(event.target.checked)}
					/>
				</label>
			)}
		/>
	);
}

function ChoiceControl<T extends FieldValues>({
	control,
	name,
	label,
	disabled = false,
	options = [],
}: FieldProps<T> & { selectionMode?: "single" | "multiple" }) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<fieldset disabled={disabled}>
					<legend>{label ?? String(name)}</legend>
					{options.map((option) => (
						<button
							key={String(option.value)}
							type="button"
							disabled={disabled}
							onClick={() => field.onChange(option.value)}
						>
							{option.label}
						</button>
					))}
				</fieldset>
			)}
		/>
	);
}

export function FormInput<T extends FieldValues>(props: FieldProps<T>) {
	return <TextControl {...props} />;
}

export function FormDateInput<T extends FieldValues>(props: FieldProps<T>) {
	return <TextControl {...props} />;
}

export function FormTimeInput<T extends FieldValues>(props: FieldProps<T>) {
	return <TextControl {...props} />;
}

export function FormSelect<T extends FieldValues>(props: FieldProps<T>) {
	const id = String(props.name);

	return (
		<Controller
			control={props.control}
			name={props.name}
			render={({ field }) => (
				<label htmlFor={id}>
					{props.label ?? id}
					<select
						id={id}
						name={field.name}
						value={String(field.value ?? "")}
						disabled={props.disabled}
						onBlur={field.onBlur}
						onChange={field.onChange}
					>
						{(props.options ?? []).map((option) => (
							<option key={String(option.value)} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</label>
			)}
		/>
	);
}

export function FormChoiceChipGroup<T extends FieldValues>(
	props: FieldProps<T> & { selectionMode?: "single" | "multiple" },
) {
	return <ChoiceControl {...props} />;
}

export function FormCheckbox<T extends FieldValues>(props: FieldProps<T>) {
	return <CheckboxControl {...props} />;
}

export function ProgramSection({
	title,
	description,
	children,
}: {
	title: ReactNode;
	description?: ReactNode;
	children: ReactNode;
}) {
	return (
		<section>
			<h2>{title}</h2>
			{description && <p>{description}</p>}
			{children}
		</section>
	);
}
