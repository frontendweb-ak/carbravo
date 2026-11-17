import { Button } from "@mui/material";

import { PageState } from "../ui";
import type { ProgramLayoutState } from "./use-program-layout-state";

export function ProgramLayoutStatus({
	state,
}: {
	state: Exclude<ProgramLayoutState, { status: "ready" }>;
}) {
	if (state.status === "loading") {
		return <PageState status="loading" loadingMessage={state.message} />;
	}

	if (state.status === "error") {
		return (
			<PageState
				status="error"
				errorTitle={state.title}
				errorDescription={state.description}
				onRetry={state.onRetry}
			/>
		);
	}

	return (
		<PageState
			status="empty"
			emptyTitle={state.title}
			emptyDescription={state.description}
			emptyAction={
				state.onReturnToCurrent ? (
					<Button variant="outlined" onClick={state.onReturnToCurrent}>
						Return to current revision
					</Button>
				) : undefined
			}
		/>
	);
}
