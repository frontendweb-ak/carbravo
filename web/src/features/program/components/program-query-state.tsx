// features/program/components/program-query-state.tsx

import type { ReactNode } from "react";

import { PageState } from "@/components/ui";

interface ProgramQueryStateProps {
	isLoading: boolean;
	isError: boolean;
	hasData: boolean;
	onRetry?: () => void;
	children: ReactNode;
}

export function ProgramQueryState({
	isLoading,
	isError,
	hasData,
	onRetry,
	children,
}: ProgramQueryStateProps) {
	if (isLoading) {
		return <PageState status="loading" loadingMessage="Loading program..." />;
	}

	if (isError) {
		return (
			<PageState
				status="error"
				errorTitle="Failed to load program"
				errorDescription="We couldn't load this program. Please try again."
				onRetry={onRetry}
			/>
		);
	}

	if (!hasData) {
		return (
			<PageState
				status="empty"
				emptyTitle="Program not found"
				emptyDescription="The requested program could not be found."
			/>
		);
	}

	return <>{children}</>;
}
