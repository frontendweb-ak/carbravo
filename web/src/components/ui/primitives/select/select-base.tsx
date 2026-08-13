import {
	Select as SelectPrimitive,
	type SelectRootChangeEventDetails,
} from "@base-ui/react/select";
import type { ComponentProps } from "react";
export type SelectProps = Omit<
	ComponentProps<typeof SelectPrimitive.Root>,
	"value" | "defaultValue" | "onValueChange"
> & {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
};

export function Select({
	value,
	defaultValue,
	onValueChange,
	...props
}: SelectProps) {
	return (
		<SelectPrimitive.Root
			{...props}
			value={value}
			defaultValue={defaultValue}
			onValueChange={(nextValue, _details: SelectRootChangeEventDetails) => {
				onValueChange?.(String(nextValue ?? ""));
			}}
		/>
	);
}
