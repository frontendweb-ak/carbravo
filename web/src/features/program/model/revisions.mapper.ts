import type {
	RevisionHistoryItemDto,
	RevisionHistoryResponseDto,
} from "../api/revisions.api";

import type { ProgramRevisionHistoryItem } from "./revisions.types";

function mapRevisionHistoryItem(
	dto: RevisionHistoryItemDto,
): ProgramRevisionHistoryItem {
	return {
		id: dto.revisionId,
		label: dto.revisionLabel,

		major: dto.majorRevision,
		minor: dto.minorRevision,

		status: dto.status,

		isMinorRevision: dto.isMinorRevision,

		createdAt: dto.createdAt,
		createdBy: dto.createdBy,

		postedAt: dto.postedAt,
		postedBy: dto.postedBy,

		isSubmitted: dto.isSubmitted,

		approved: dto.approved,
		approvedAt: dto.approvedAt,
		approvedBy: dto.approvedBy,

		rejectedAt: dto.rejectedAt,
		rejectedBy: dto.rejectedBy,
		rejectionReason: dto.rejectionReason,

		copiedFromRevisionId: dto.copiedFromRevisionId,
	};
}

export function mapRevisionHistory(dto: RevisionHistoryResponseDto) {
	return {
		programId: dto.programId,
		programIdentifier: dto.programIdentifier,
		programName: dto.programName,

		activeRevisionId: dto.activeRevisionId,
		draftRevisionId: dto.draftRevisionId,

		revisions: dto.revisions.map(mapRevisionHistoryItem),
	};
}
