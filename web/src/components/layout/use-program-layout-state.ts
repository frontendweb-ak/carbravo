import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useProgram, useProgramRevisionHistory } from "@/features/program";
import type {
	ProgramEditorMode,
	ProgramWorkflowStatus,
} from "@/features/program/editor/program-editor-context";
import type { ProgramRevisionTab } from "@/features/program/components/layout/program-context-header";
import type { ProgramRevisionHistoryState } from "@/features/program/model/revisions.types";
import {
	getCurrentRevision,
	getProgramRevisionSelection,
	getProgramRevisionTabs,
	getSelectedRevision,
} from "@/features/program/utils";

import { parseProgramId } from "./program-layout.utils";

export type ProgramLayoutState =
	| { status: "loading"; message: string }
	| {
			status: "error";
			title: string;
			description: string;
			onRetry: () => void;
	  }
	| {
			status: "empty";
			title: string;
			description: string;
			onReturnToCurrent?: () => void;
	  }
	| {
			status: "ready";
			programId?: number;
			revisionId?: number;
			programIdentifier?: string;
			programName?: string;
			revisionLabel?: string;
			programStatus?: ProgramWorkflowStatus;
			isMinorRevision: boolean;
			revisionTabs: ProgramRevisionTab[];
			revisionHistory?: ProgramRevisionHistoryState;
			currentRevisionId?: number;
			revisionHistoryError: boolean;
			onRetryRevisionHistory: () => void;
	  };

export function useProgramLayoutState(
	mode: ProgramEditorMode,
): ProgramLayoutState {
	const { programId: routeProgramId } = useParams<{ programId: string }>();
	const location = useLocation();
	const navigate = useNavigate();

	const programId = parseProgramId(routeProgramId);
	const programQuery = useProgram(mode === "edit" ? programId : undefined);
	const revisionHistoryQuery = useProgramRevisionHistory(
		mode === "edit" ? programId : undefined,
	);
	const revisionSelection = getProgramRevisionSelection(location.search);
	const isHistoryView =
		mode === "edit" && revisionSelection.view === "history";
	const isHistoryList =
		isHistoryView && revisionSelection.revisionId == null;

	const returnToCurrent = () => {
		navigate({ pathname: location.pathname, search: "" });
	};

	if (mode === "edit") {
		if (programId == null) {
			return {
				status: "empty",
				title: "Invalid program link",
				description:
					"The program ID in this URL is not valid. Open a program from the Programs page.",
			};
		}

		if (programQuery.isLoading) {
			return { status: "loading", message: "Loading program..." };
		}

		if (programQuery.isError) {
			return {
				status: "error",
				title: "Failed to load program",
				description: "We couldn't load this program. Please try again.",
				onRetry: programQuery.refetch,
			};
		}

		if (!programQuery.data) {
			return {
				status: "empty",
				title: "Program not found",
				description: "The requested program could not be found.",
			};
		}

		if (revisionSelection.invalidRevision) {
			return {
				status: "empty",
				title: "Invalid revision link",
				description: "The revision ID in this URL is not valid.",
				onReturnToCurrent: returnToCurrent,
			};
		}

		if (isHistoryView && revisionHistoryQuery.isLoading) {
			return {
				status: "loading",
				message: "Loading revision history...",
			};
		}

		if (isHistoryView && revisionHistoryQuery.isError) {
			return {
				status: "error",
				title: "Failed to load revision history",
				description:
					"We couldn't load the selected revision. Please try again.",
				onRetry: revisionHistoryQuery.refetch,
			};
		}

		if (isHistoryView && !revisionHistoryQuery.data) {
			return {
				status: "empty",
				title: "Revision history unavailable",
				description:
					"No revision history was returned for this program.",
				onReturnToCurrent: returnToCurrent,
			};
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

		return {
			status: "empty",
			title,
			description,
			onReturnToCurrent: returnToCurrent,
		};
	}

	const programStatus = (() => {
		if (mode === "edit" && program?.status === "EXPIRED") return "EXPIRED";
		if (!selectedRevision) return undefined;
		if (
			selectedRevision.status === "ACTIVE" ||
			selectedRevision.status === "EXPIRED"
		) {
			return selectedRevision.status;
		}
		if (selectedRevision.approved) return "APPROVED";
		if (selectedRevision.isSubmitted) return "REVIEW";
		return "DRAFT";
	})();

	return {
		status: "ready",
		programId: mode === "edit" ? program?.id : undefined,
		revisionId: selectedRevision?.id ?? undefined,
		programIdentifier: mode === "edit" ? program?.identifier : undefined,
		programName: mode === "edit" ? program?.name : undefined,
		revisionLabel:
			mode === "edit" ? (selectedRevision?.label ?? undefined) : undefined,
		programStatus,
		isMinorRevision:
			mode === "edit" ? (selectedRevision?.isMinorRevision ?? false) : false,
		revisionTabs,
		revisionHistory,
		currentRevisionId: currentRevision?.id ?? undefined,
		revisionHistoryError:
			mode === "edit" && !isHistoryView && revisionHistoryQuery.isError,
		onRetryRevisionHistory: revisionHistoryQuery.refetch,
	};
}
