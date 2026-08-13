import { cn } from "@/utils";
import { forwardRef } from "react";
import { Flex, type FlexProps } from "./flex";

export const Row = forwardRef<HTMLDivElement, FlexProps>(
	({ className, ...props }, ref) => (
		<Flex ref={ref} className={cn("flex-row", className)} {...props} />
	),
);

Row.displayName = "Row";
