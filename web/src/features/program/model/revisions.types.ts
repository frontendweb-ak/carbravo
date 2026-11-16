import type { RevisionStatusDto } from "../api/programs.api";
import type { PaginationDto } from "../api/revisions.api";

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
}

export interface ProgramRevisionHistoryState {
  revisions: ProgramRevisionHistoryItem[];
  pagination: PaginationDto;
}
