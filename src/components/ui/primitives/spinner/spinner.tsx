import type { ComponentProps } from "react";

import { cn } from "@/utils";

export interface SpinnerProps extends ComponentProps<"svg"> {
	size?: "sm" | "md" | "lg";
}

const spinnerSizes = {
	sm: "size-3.5",
	md: "size-5",
	lg: "size-7",
};

function Spinner({ className, size = "md", ...props }: SpinnerProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			className={cn("animate-spin text-current", spinnerSizes[size], className)}
			{...props}
		>
			<circle
				cx="12"
				cy="12"
				r="9"
				stroke="currentColor"
				strokeWidth="3"
				className="opacity-20"
			/>

			<path
				d="M21 12a9 9 0 0 0-9-9"
				stroke="currentColor"
				strokeWidth="3"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export { Spinner };
