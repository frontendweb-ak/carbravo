import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import type { ComponentProps } from "react";

import { cn } from "@/utils";

export interface SeparatorProps extends ComponentProps<
	typeof SeparatorPrimitive
> {
	orientation?: "horizontal" | "vertical";
}

function Separator({
	className,
	orientation = "horizontal",
	...props
}: SeparatorProps) {
	return (
		<SeparatorPrimitive
			data-slot="separator"
			orientation={orientation}
			className={cn(
				"shrink-0 bg-border",
				orientation === "horizontal" && "h-px w-full",
				orientation === "vertical" && "h-full w-px self-stretch",
				className,
			)}
			{...props}
		/>
	);
}

export { Separator };
