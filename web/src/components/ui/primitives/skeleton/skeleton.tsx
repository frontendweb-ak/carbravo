import type { ComponentProps } from "react";

import { cn } from "@/utils";

export interface SkeletonProps extends ComponentProps<"div"> {}

function Skeleton({ className, ...props }: SkeletonProps) {
	return (
		<div
			data-slot="skeleton"
			aria-hidden="true"
			className={cn("animate-pulse rounded-md bg-muted", className)}
			{...props}
		/>
	);
}

export { Skeleton };
