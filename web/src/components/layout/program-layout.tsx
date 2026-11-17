import {
	type ProgramEditorMode,
	ProgramEditorProvider,
} from "@/features/program/editor/program-editor-context";
import { ProgramLayoutContent } from "@/features/program/components";

import { ProgramLayoutStatus } from "./program-layout-status";
import { useProgramLayoutState } from "./use-program-layout-state";

interface ProgramLayoutProps {
	mode?: ProgramEditorMode;
}

function ProgramLayout({ mode = "edit" }: ProgramLayoutProps) {
	const state = useProgramLayoutState(mode);

	if (state.status !== "ready") {
		return <ProgramLayoutStatus state={state} />;
	}

	return (
		<ProgramEditorProvider
			mode={mode}
			programId={state.programId}
			revisionId={state.revisionId}
			programIdentifier={state.programIdentifier}
			programName={state.programName}
			revisionLabel={state.revisionLabel}
			programStatus={state.programStatus}
			isMinorRevision={state.isMinorRevision}
		>
			<ProgramLayoutContent
				revisionTabs={state.revisionTabs}
				revisionHistory={state.revisionHistory}
				currentRevisionId={state.currentRevisionId}
				revisionHistoryError={state.revisionHistoryError}
				onRetryRevisionHistory={state.onRetryRevisionHistory}
			/>
		</ProgramEditorProvider>
	);
}

export default ProgramLayout;
