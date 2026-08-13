import { CalendarClock } from "lucide-react";
import { forwardRef, useRef } from "react";

import { cn, mergeRefs } from "@/utils";

import type { InputProps } from "./input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "./input-group";

export type DateTimeInputProps = Omit<InputProps, "type">;

const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
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
					type="datetime-local"
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
						aria-label="Open date and time picker"
						onClick={openPicker}
					>
						<CalendarClock aria-hidden="true" />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		);
	},
);

DateTimeInput.displayName = "DateTimeInput";

export { DateTimeInput };
