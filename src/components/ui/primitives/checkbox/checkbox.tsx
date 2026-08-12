import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";

import { cn } from "@/utils";

export type CheckboxProps = CheckboxPrimitive.Root.Props;

function Checkbox({
	className,
	indeterminate = false,
	disabled,
	...props
}: CheckboxProps) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			indeterminate={indeterminate}
			disabled={disabled}
			className={cn(
				/* ---------------------------------------------------------------- */
				/* Layout                                                           */
				/* ---------------------------------------------------------------- */

				"peer relative flex size-4 shrink-0",
				"items-center justify-center",

				/* ---------------------------------------------------------------- */
				/* Shape                                                            */
				/* ---------------------------------------------------------------- */

				"rounded-sm",

				/* ---------------------------------------------------------------- */
				/* Base                                                             */
				/* ---------------------------------------------------------------- */

				"border border-input",
				"bg-background",
				"text-primary-foreground",
				"shadow-xs",

				"outline-none",
				"select-none",
				"transition-colors",

				/* ---------------------------------------------------------------- */
				/* Hover                                                            */
				/* ---------------------------------------------------------------- */

				"hover:border-ring/70",

				/* ---------------------------------------------------------------- */
				/* Focus                                                            */
				/* ---------------------------------------------------------------- */

				"focus-visible:border-ring",
				"focus-visible:ring-3",
				"focus-visible:ring-ring/50",

				/* ---------------------------------------------------------------- */
				/* Checked                                                          */
				/* ---------------------------------------------------------------- */

				"data-checked:border-primary",
				"data-checked:bg-primary",
				"data-checked:text-primary-foreground",

				/* ---------------------------------------------------------------- */
				/* Indeterminate                                                     */
				/* ---------------------------------------------------------------- */

				"data-indeterminate:border-primary",
				"data-indeterminate:bg-primary",
				"data-indeterminate:text-primary-foreground",

				/* ---------------------------------------------------------------- */
				/* Disabled                                                         */
				/* ---------------------------------------------------------------- */

				"disabled:pointer-events-none",
				"disabled:cursor-not-allowed",
				"disabled:opacity-50",

				/* ---------------------------------------------------------------- */
				/* Invalid                                                          */
				/* ---------------------------------------------------------------- */

				"aria-invalid:border-destructive",
				"aria-invalid:ring-3",
				"aria-invalid:ring-destructive/20",

				"dark:aria-invalid:border-destructive/50",
				"dark:aria-invalid:ring-destructive/40",

				/* ---------------------------------------------------------------- */
				/* Dark mode                                                        */
				/* ---------------------------------------------------------------- */

				"dark:bg-input/30",
				"dark:data-checked:bg-primary",
				"dark:data-indeterminate:bg-primary",

				/* ---------------------------------------------------------------- */
				/* Accessible hit area                                              */
				/* ---------------------------------------------------------------- */

				"after:absolute",
				"after:-inset-x-2",
				"after:-inset-y-2",

				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="grid size-full place-items-center"
			>
				{indeterminate ? (
					<MinusIcon
						aria-hidden="true"
						className="size-3.5"
						strokeWidth={2.5}
					/>
				) : (
					<CheckIcon
						aria-hidden="true"
						className="size-3.5"
						strokeWidth={2.5}
					/>
				)}
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
