import { Logo } from "@/components/layout/logo";
import { Spinner } from "@/components/ui/primitives/spinner";
import { cn } from "@/utils";

export interface GlobalLoaderProps {
	visible?: boolean;
	message?: string;
	className?: string;
}

function GlobalLoader({
	visible = true,
	message = "Loading...",
	className,
}: GlobalLoaderProps) {
	if (!visible) {
		return null;
	}

	return (
		<div
			role="status"
			aria-live="polite"
			aria-label={message}
			className={cn(
				"fixed inset-0 z-[9999]",
				"flex items-center justify-center",
				"bg-background/95 backdrop-blur-sm",
				className,
			)}
		>
			<div className="flex flex-col items-center gap-4">
				<Logo size={40} />

				<Spinner className="size-5" />

				<span className="text-sm text-muted-foreground">{message}</span>
			</div>
		</div>
	);
}

export { GlobalLoader };
