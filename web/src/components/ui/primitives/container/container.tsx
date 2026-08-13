import type { ComponentProps } from "react";

import { cn } from "@/utils";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ContainerProps extends ComponentProps<"div"> {
	size?: ContainerSize;
	centered?: boolean;
}

const containerSizes: Record<ContainerSize, string> = {
	sm: "max-w-2xl",
	md: "max-w-4xl",
	lg: "max-w-5xl",
	xl: "max-w-6xl",
	"2xl": "max-w-[1360px]",
	full: "max-w-none",
};

function Container({
	size = "2xl",
	centered = true,
	className,
	...props
}: ContainerProps) {
	return (
		<div
			data-slot="container"
			data-size={size}
			className={cn(
				"w-full",
				containerSizes[size],
				centered && "mx-auto",
				"sm:px-6 lg:px-8",
				className,
			)}
			{...props}
		/>
	);
}

export { Container };
