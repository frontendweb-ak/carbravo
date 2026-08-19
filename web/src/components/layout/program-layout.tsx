import { useLocation, useParams } from "react-router-dom";

import { useProgram, useProgramRevisionHistory } from "@/features/program";

import {
	type ProgramEditorMode,
	ProgramEditorProvider,
} from "@/features/program/editor/program-editor-context";

import {
	getCurrentRevision,
	getProgramRevisionSelection,
	getProgramRevisionTabs,
	getSelectedRevision,
} from "@/features/program/utils";

import { ProgramLayoutContent } from "@/features/program/components";
import { PageState } from "../ui";

interface ProgramLayoutProps {
	mode?: ProgramEditorMode;
}

function ProgramLayout({ mode = "edit" }: ProgramLayoutProps) {
	const { programId } = useParams<{ programId: string }>();
	const location = useLocation();

	const numericProgramId = programId ? Number(programId) : undefined;
	const programQuery = useProgram(
		mode === "edit" ? numericProgramId : undefined,
	);

	const revisionHistoryQuery = useProgramRevisionHistory(
		mode === "edit" ? numericProgramId : undefined,
	);

	/*
	 * Existing program must be resolved before
	 * initializing the editor provider.
	 */
	if (mode === "edit") {
		if (programQuery.isLoading) {
			return <PageState status="loading" loadingMessage="Loading program..." />;
		}

		if (programQuery.isError) {
			return (
				<PageState
					status="error"
					errorTitle="Failed to load program"
					errorDescription="We couldn't load this program. Please try again."
					onRetry={programQuery.refetch}
				/>
			);
		}

		if (!programQuery.data) {
			return (
				<PageState
					status="empty"
					emptyTitle="Program not found"
					emptyDescription="The requested program could not be found."
				/>
			);
		}
	}

	const program = programQuery.data;
	const revisionHistory = revisionHistoryQuery.data;
	/*
	 * Determine which revision view the URL requests.
	 */
	const revisionSelection = getProgramRevisionSelection(location.search);
	/*
	 * Current revision.
	 */
	const currentRevision =
		mode === "edit" && program ? getCurrentRevision(program) : null;
	/*
	 * Build tabs from API data.
	 */
	const revisionTabs =
		mode === "edit" && program && revisionHistory
			? getProgramRevisionTabs(program, revisionHistory)
			: [];
	/*
	 * Resolve actual revision.
	 */
	const selectedRevision =
		mode === "edit" && program && revisionHistory
			? getSelectedRevision(program, revisionHistory, revisionSelection)
			: null;
	const revisionId = selectedRevision?.id ?? undefined;

	return (
		<ProgramEditorProvider
			mode={mode}
			programId={mode === "edit" ? program?.id : undefined}
			revisionId={revisionId}
			programIdentifier={mode === "edit" ? program?.identifier : undefined}
			programName={mode === "edit" ? program?.name : undefined}
			revisionLabel={
				mode === "edit" ? (selectedRevision?.label ?? undefined) : undefined
			}
			programStatus={
				mode === "edit" ? (selectedRevision?.status ?? undefined) : undefined
			}
		>
			<ProgramLayoutContent
				revisionTabs={revisionTabs}
				revisionHistory={revisionHistory}
				currentRevisionId={currentRevision?.id ?? undefined}
			/>
		</ProgramEditorProvider>
	);
}

export default ProgramLayout;
