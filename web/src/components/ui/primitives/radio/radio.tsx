import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { CircleIcon } from "lucide-react";

import { cn } from "@/utils";

export type RadioProps = RadioPrimitive.Root.Props;

function Radio({ className, disabled, ...props }: RadioProps) {
    return (
        <RadioPrimitive.Root
            data-slot="radio"
            disabled={disabled}
            className={cn(
                "peer relative flex size-4 shrink-0",
                "items-center justify-center",
                "rounded-full border border-input",
                "bg-background",
                "text-primary-foreground",
                "shadow-xs",
                "outline-none",
                "transition-colors",

                // Hover
                "hover:border-ring/70",

                // Focus
                "focus-visible:border-ring",
                "focus-visible:ring-3",
                "focus-visible:ring-ring/50",

                // Checked
                "data-checked:border-primary",
                "data-checked:bg-primary",

                // Disabled
                "disabled:pointer-events-none",
                "disabled:cursor-not-allowed",
                "disabled:opacity-50",

                // Invalid
                "aria-invalid:border-destructive",
                "aria-invalid:ring-3",
                "aria-invalid:ring-destructive/20",

                "dark:aria-invalid:border-destructive/50",
                "dark:aria-invalid:ring-destructive/40",

                // Dark mode
                "dark:bg-input/30",
                "dark:data-checked:bg-primary",

                // Accessible hit area
                "after:absolute",
                "after:-inset-x-2",
                "after:-inset-y-2",

                className,
            )}
            {...props}
        >
            <RadioPrimitive.Indicator
                data-slot="radio-indicator"
                className="flex items-center justify-center"
            >
                <CircleIcon
                    aria-hidden="true"
                    className="size-2.5 fill-current"
                />
            </RadioPrimitive.Indicator>
        </RadioPrimitive.Root>
    );
}

export { Radio };
