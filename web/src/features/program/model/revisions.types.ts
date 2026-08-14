import type { RevisionStatusDto } from "../api/programs.api";

export type RevisionStatus = RevisionStatusDto;

export interface ProgramRevisionHistoryItem {
	id: number;
	label: string;

	major: number;
	minor: number;

	status: RevisionStatus;

	isMinorRevision: boolean;

	createdAt: string;
	createdBy: string;

	postedAt: string | null;
	postedBy: string | null;

	isSubmitted: boolean;

	approved: boolean;
	approvedAt: string | null;
	approvedBy: string | null;

	rejectedAt: string | null;
	rejectedBy: string | null;
	rejectionReason: string | null;

	copiedFromRevisionId: number | null;
}

export interface ProgramRevisionHistoryState {
	programId: number;
	programIdentifier: string;
	programName: string;

	activeRevisionId: number | null;
	draftRevisionId: number | null;

	revisions: ProgramRevisionHistoryItem[];
}
