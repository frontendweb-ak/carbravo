import { Clock3 } from "lucide-react";
import { forwardRef, useRef } from "react";

import { cn, mergeRefs } from "@/utils";

import type { InputProps } from "./input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "./input-group";

export type TimeInputProps = Omit<InputProps, "type">;

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
	({ className, disabled, ...props }, forwardedRef) => {
		const inputRef = useRef<HTMLInputElement>(null);

		const openPicker = () => {
			if (disabled) return;

			const input = inputRef.current;

			if (!input) return;

			input.focus();

			if (typeof input.showPicker === "function") {
				input.showPicker();
			}
		};

		return (
			<InputGroup>
				<InputGroupInput
					{...props}
					ref={mergeRefs(inputRef, forwardedRef)}
					type="time"
					disabled={disabled}
					className={cn(
						"pr-1",
						"[&::-webkit-calendar-picker-indicator]:opacity-0",
						"[&::-webkit-calendar-picker-indicator]:cursor-pointer",
						className,
					)}
				/>

				<InputGroupAddon align="inline-end">
					<InputGroupButton
						type="button"
						variant="ghost"
						size="icon-sm"
						disabled={disabled}
						aria-label="Open time picker"
						onClick={openPicker}
					>
						<Clock3 aria-hidden="true" className="size-4" />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		);
	},
);

TimeInput.displayName = "TimeInput";

export { TimeInput };
