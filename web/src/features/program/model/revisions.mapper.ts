import type {
  RevisionHistoryItemDto,
  RevisionHistoryResponseDto,
} from "../api/revisions.api";
import type { ProgramRevisionHistoryItem } from "./revisions.types";

function mapRevisionHistoryItem(dto: RevisionHistoryItemDto): ProgramRevisionHistoryItem {
  return {
    id: dto.revisionId,
    label: dto.revisionLabel,
    major: dto.majorRevision,
    minor: dto.minorRevision,
    status: dto.revisionStatus,
    isMinorRevision: dto.isMinorRevision,
    createdAt: dto.createdAt,
    createdBy: dto.createdBy,
    postedAt: dto.postedAt,
    postedBy: dto.postedBy,
    isSubmitted: dto.isSubmitted,
    approved: dto.approved,
  };
}

export function mapRevisionHistory(dto: RevisionHistoryResponseDto) {
  return {
    revisions: dto.content.map(mapRevisionHistoryItem),
    pagination: dto.pagination,
  };
}
