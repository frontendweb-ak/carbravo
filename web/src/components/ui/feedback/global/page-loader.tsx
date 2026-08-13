import { Spinner } from "../../primitives";

export interface PageLoaderProps {
	message?: string;
}

function PageLoader({ message = "Loading..." }: PageLoaderProps) {
	return (
		<div
			data-slot="page-loader"
			className="flex min-h-96 items-center justify-center"
			role="status"
			aria-live="polite"
		>
			<div className="flex items-center gap-3 text-sm text-muted-foreground">
				<Spinner size="sm" />
				<span>{message}</span>
			</div>
		</div>
	);
}

export { PageLoader };
