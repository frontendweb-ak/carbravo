import type { ReactNode } from "react";

export interface OptionGroupAccessors<T> {
	getValue?: (option: T) => string;
	getLabel?: (option: T) => ReactNode;
	getDescription?: (option: T) => ReactNode;
	getDisabled?: (option: T) => boolean;
}

type DefaultOption = {
	value?: unknown;
	label?: ReactNode;
	description?: ReactNode;
	disabled?: boolean;
};

export interface ResolvedOption<T> {
	/**
	 * Original option object.
	 *
	 * Useful when a component needs valueType="object".
	 */
	original: T;

	/**
	 * Normalized option value.
	 */
	value: string;

	/**
	 * Display label.
	 */
	label: ReactNode;

	/**
	 * Optional description.
	 */
	description: ReactNode;

	/**
	 * Whether this option is disabled.
	 */
	disabled: boolean;
}

function resolveOption<T>(
	option: T,
	accessors: OptionGroupAccessors<T>,
): ResolvedOption<T> {
	const { getValue, getLabel, getDescription, getDisabled } = accessors;

	const defaultOption =
		typeof option === "object" && option !== null
			? (option as DefaultOption)
			: undefined;

	const value = getValue
		? getValue(option)
		: defaultOption && "value" in defaultOption
			? String(defaultOption.value)
			: undefined;

	if (value === undefined || value === "") {
		throw new Error(
			"OptionGroup requires getValue when options do not contain a value property.",
		);
	}

	return {
		original: option,

		value,

		label: getLabel ? getLabel(option) : (defaultOption?.label ?? null),

		description: getDescription
			? getDescription(option)
			: (defaultOption?.description ?? null),

		disabled: getDisabled
			? getDisabled(option)
			: Boolean(defaultOption?.disabled),
	};
}

export { resolveOption };
