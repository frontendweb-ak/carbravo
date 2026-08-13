import { cn } from "@/utils";

export interface FieldRequiredProps {
	children?: React.ReactNode;
	className?: string;
}

function FieldRequired({
	children = "REQUIRED",
	className,
}: FieldRequiredProps) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"ml-2 inline-flex items-center",
				"rounded-sm",
				"bg-amber-100 px-1.5 py-0.5",
				"text-[10px] font-bold leading-none tracking-wide",
				"text-amber-700",
				"dark:bg-amber-950/40 dark:text-amber-400",
				className,
			)}
		>
			{children}
		</span>
	);
}

export { FieldRequired };
