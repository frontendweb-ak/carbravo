import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/utils";

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
	asChild?: boolean;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
	({ asChild = false, className, ...props }, ref) => {
		const Component = asChild ? Slot : "div";
		return <Component ref={ref} className={cn(className)} {...props} />;
	},
);

Box.displayName = "Box";
