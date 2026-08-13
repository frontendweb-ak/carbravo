import type { ReactNode } from "react";

import { EmptyState } from "../empty-state";
import { ErrorState } from "../error-state";
import { PageLoader } from "../global";

export type PageStateStatus = "loading" | "error" | "empty" | "ready";

export interface PageStateProps {
	status: PageStateStatus;

	children?: ReactNode;

	loadingMessage?: string;

	errorTitle?: ReactNode;
	errorDescription?: ReactNode;
	onRetry?: () => void;

	emptyTitle?: ReactNode;
	emptyDescription?: ReactNode;
	emptyAction?: ReactNode;
}

function PageState({
	status,
	children,

	loadingMessage = "Loading...",

	errorTitle = "Unable to load data",
	errorDescription = "Something went wrong while loading this information.",
	onRetry,

	emptyTitle = "Nothing here yet",
	emptyDescription,
	emptyAction,
}: PageStateProps) {
	switch (status) {
		case "loading":
			return <PageLoader message={loadingMessage} />;

		case "error":
			return (
				<ErrorState
					title={errorTitle}
					description={errorDescription}
					onRetry={onRetry}
				/>
			);

		case "empty":
			return (
				<EmptyState
					title={emptyTitle}
					description={emptyDescription}
					action={emptyAction}
				/>
			);

		case "ready":
			return <>{children}</>;

		default:
			return null;
	}
}

export { PageState };
