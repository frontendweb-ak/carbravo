import { cn } from "@/utils";
import { forwardRef } from "react";
import { Box, type BoxProps } from "./box";

export type FlexJustify =
	| "start"
	| "center"
	| "end"
	| "between"
	| "around"
	| "evenly";

export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";

export interface FlexProps extends BoxProps {
	justify?: FlexJustify;
	align?: FlexAlign;
	wrap?: boolean;
	gap?: number | string;
}

const justifyMap = {
	start: "justify-start",
	center: "justify-center",
	end: "justify-end",
	between: "justify-between",
	around: "justify-around",
	evenly: "justify-evenly",
};

const alignMap = {
	start: "items-start",
	center: "items-center",
	end: "items-end",
	stretch: "items-stretch",
	baseline: "items-baseline",
};

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
	({ justify, align, wrap, gap, className, style, ...props }, ref) => {
		return (
			<Box
				ref={ref}
				className={cn(
					"flex",
					justify && justifyMap[justify],
					align && alignMap[align],
					wrap && "flex-wrap",
					className,
				)}
				style={{
					gap,
					...style,
				}}
				{...props}
			/>
		);
	},
);

Flex.displayName = "Flex";
