import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import type { ComponentProps } from "react";

import { cn } from "@/utils";

export type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive> & {
	orientation?: "vertical" | "horizontal";
};

function RadioGroup({
	className,
	orientation = "vertical",
	...props
}: RadioGroupProps) {
	return (
		<RadioGroupPrimitive
			data-slot="radio-group"
			data-orientation={orientation}
			className={cn(
				"flex",
				orientation === "vertical"
					? "flex-col gap-3"
					: "flex-row flex-wrap gap-x-6 gap-y-3",
				className,
			)}
			{...props}
		/>
	);
}

export { RadioGroup };
