import { CalendarDays } from "lucide-react";
import { forwardRef, useRef } from "react";

import { cn, displayToIso, isoToDisplay, mergeRefs } from "@/utils";

import type { InputProps } from "./input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "./input-group";

export type DateInputProps = Omit<InputProps, "type">;
const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
	({ className, disabled, value, onChange, ...props }, forwardedRef) => {
		const inputRef = useRef<HTMLInputElement>(null);

		const openPicker = () => {
			if (disabled) return;
			inputRef.current?.showPicker?.();
		};

		const isoValue = displayToIso(String(value ?? ""));

		return (
			<InputGroup>
				<InputGroupInput
					readOnly
					value={value ?? ""}
					placeholder="DD-MM-YYYY"
					disabled={disabled}
					className={cn("pr-1", className)}
				/>

				<input
					ref={mergeRefs(inputRef, forwardedRef)}
					type="date"
					value={isoValue}
					disabled={disabled}
					className="absolute inset-0 pointer-events-none opacity-0"
					onChange={(event) => {
						const displayValue = isoToDisplay(event.target.value);

						if (typeof onChange === "function") {
							onChange(displayValue as never);
						}
					}}
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

