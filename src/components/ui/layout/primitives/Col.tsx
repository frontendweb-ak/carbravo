import { cn } from "@/utils";
import { forwardRef } from "react";
import { Flex, type FlexProps } from "./Flex";

export const Col = forwardRef<HTMLDivElement, FlexProps>(
	({ className, ...props }, ref) => (
		<Flex ref={ref} className={cn("flex-col", className)} {...props} />
	),
);

Col.displayName = "Col";
