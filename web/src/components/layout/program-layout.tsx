import { Button } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
import { parseProgramId } from "./program-layout.utils";

interface ProgramLayoutProps {
	mode?: ProgramEditorMode;
}

function ProgramLayout({ mode = "edit" }: ProgramLayoutProps) {
	const { programId } = useParams<{ programId: string }>();
	const location = useLocation();
	const navigate = useNavigate();

	const numericProgramId = parseProgramId(programId);
	const programQuery = useProgram(
		mode === "edit" ? numericProgramId : undefined,
	);
	const revisionHistoryQuery = useProgramRevisionHistory(
		mode === "edit" ? numericProgramId : undefined,
	);
	const revisionSelection = getProgramRevisionSelection(location.search);
	const isHistoryView = mode === "edit" && revisionSelection.view === "history";
	const isHistoryList = isHistoryView && revisionSelection.revisionId == null;

	const returnToCurrentRevision = () => {
		navigate({
			pathname: location.pathname,
			search: "",
		});
	};

	if (mode === "edit") {
		if (numericProgramId == null) {
			return (
				<PageState
					status="empty"
					emptyTitle="Invalid program link"
					emptyDescription="The program ID in this URL is not valid. Open a program from the Programs page."
				/>
			);
		}

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

		if (revisionSelection.invalidRevision) {
			return (
				<PageState
					status="empty"
					emptyTitle="Invalid revision link"
					emptyDescription="The revision ID in this URL is not valid."
					emptyAction={
						<Button variant="outlined" onClick={returnToCurrentRevision}>
							Return to current revision
						</Button>
					}
				/>
			);
		}

		if (isHistoryView && revisionHistoryQuery.isLoading) {
			return (
				<PageState
					status="loading"
					loadingMessage="Loading revision history..."
				/>
			);
		}

		if (isHistoryView && revisionHistoryQuery.isError) {
			return (
				<PageState
					status="error"
					errorTitle="Failed to load revision history"
					errorDescription="We couldn't load the selected revision. Please try again."
					onRetry={revisionHistoryQuery.refetch}
				/>
			);
		}

		if (
			isHistoryView &&
			!revisionHistoryQuery.data
		) {
			return (
				<PageState
					status="empty"
					emptyTitle="Revision history unavailable"
					emptyDescription="No revision history was returned for this program."
					emptyAction={
						<Button variant="outlined" onClick={returnToCurrentRevision}>
							Return to current revision
						</Button>
					}
				/>
			);
		}
	}

	const program = programQuery.data;
	const revisionHistory = revisionHistoryQuery.data;
	const currentRevision =
		mode === "edit" && program ? getCurrentRevision(program) : null;
	const revisionTabs =
		mode === "edit" && program
			? getProgramRevisionTabs(program, revisionHistory)
			: [];
	const selectedRevision =
		mode === "edit" && program
			? getSelectedRevision(program, revisionHistory, revisionSelection)
			: null;

	if (mode === "edit" && !isHistoryList && !selectedRevision) {
		const title =
			revisionSelection.view === "active"
				? "Active revision not found"
				: revisionSelection.view === "history"
					? "Revision not found"
					: "No revision available";
		const description =
			revisionSelection.view === "active"
				? "This program does not have an available active revision."
				: revisionSelection.view === "history"
					? "The requested revision is not part of this program's history."
					: "This program does not have a draft or active revision to edit.";

		return (
			<PageState
				status="empty"
				emptyTitle={title}
				emptyDescription={description}
				emptyAction={
					<Button variant="outlined" onClick={returnToCurrentRevision}>
						Return to current revision
					</Button>
				}
			/>
		);
	}

	const selectedWorkflowStatus = (() => {
		if (mode === "edit" && program?.status === "EXPIRED") return "EXPIRED" as const;
		if (!selectedRevision) return undefined;
		if (
			selectedRevision.status === "ACTIVE" ||
			selectedRevision.status === "EXPIRED"
		) {
			return selectedRevision.status;
		}
		if (selectedRevision.approved) return "APPROVED" as const;
		if (selectedRevision.isSubmitted) return "REVIEW" as const;
		return "DRAFT" as const;
	})();

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
			programStatus={mode === "edit" ? selectedWorkflowStatus : undefined}
			isMinorRevision={
				mode === "edit" ? (selectedRevision?.isMinorRevision ?? false) : false
			}
		>
			<ProgramLayoutContent
				revisionTabs={revisionTabs}
				revisionHistory={revisionHistory}
				currentRevisionId={currentRevision?.id ?? undefined}
				revisionHistoryError={
					mode === "edit" &&
					!isHistoryView &&
					revisionHistoryQuery.isError
				}
				onRetryRevisionHistory={revisionHistoryQuery.refetch}
			/>
		</ProgramEditorProvider>
	);
}

export default ProgramLayout;
