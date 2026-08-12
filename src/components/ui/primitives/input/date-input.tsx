import { CalendarDays } from "lucide-react";
import { forwardRef, useRef } from "react";

import { cn, mergeRefs } from "@/utils";

import type { InputProps } from "./input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "./input-group";

export type DateInputProps = Omit<InputProps, "type">;

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
	({ className, disabled, ...props }, forwardedRef) => {
		const inputRef = useRef<HTMLInputElement>(null);

		const openPicker = () => {
			if (disabled) return;

			inputRef.current?.showPicker?.();
		};

		return (
			<InputGroup>
				<InputGroupInput
					{...props}
					ref={mergeRefs(inputRef, forwardedRef)}
					type="date"
					disabled={disabled}
					className={cn(
						"pr-1",
						"[&::-webkit-calendar-picker-indicator]:hidden",
						"[&::-webkit-calendar-picker-indicator]:appearance-none",
						className,
					)}
				/>

				<InputGroupAddon align="inline-end">
					<InputGroupButton
						type="button"
						variant="ghost"
						size="icon-sm"
						disabled={disabled}
						aria-label="Open date picker"
						onClick={openPicker}
					>
						<CalendarDays aria-hidden="true" />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		);
	},
);

DateInput.displayName = "DateInput";

export { DateInput };
