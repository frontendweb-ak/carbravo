import { cn } from "@/utils";
import { AlertCircle, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../primitives";

export interface ErrorStateProps {
	title?: ReactNode;
	description?: ReactNode;
	onRetry?: () => void;
	retryLabel?: ReactNode;
	className?: string;
}

function ErrorState({
	title = "Unable to load data",
	description = "Something went wrong while loading this information.",
	onRetry,
	retryLabel = "Try again",
	className,
}: ErrorStateProps) {
	return (
		<div
			data-slot="error-state"
			role="alert"
			className={cn(
				"flex min-h-40 flex-col items-center justify-center",
				"px-6 py-8 text-center",
				className,
			)}
		>
			<div className="mb-3 flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
				<AlertCircle className="size-5" />
			</div>

			<h3 className="text-sm font-semibold text-foreground">{title}</h3>

			<p className="mt-1 max-w-md text-sm text-muted-foreground">
				{description}
			</p>

			{onRetry && (
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="mt-4 gap-2"
					onClick={onRetry}
				>
					<RefreshCw className="size-3.5" />
					{retryLabel}
				</Button>
			)}
		</div>
	);
}

export { ErrorState };
