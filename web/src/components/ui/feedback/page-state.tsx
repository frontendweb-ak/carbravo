import Box from "@mui/material/Box";
import type { ReactNode } from "react";

import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";
import { PageLoader } from "./page-loader";

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
			return <PageLoader fullPage message={loadingMessage} />;

		case "error":
			return (
				<ErrorState
					fullPage
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

		default:
			return <Box>{children}</Box>;
	}
}

export { PageState };

