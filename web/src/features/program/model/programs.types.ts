// src/features/program/model/programs.types.ts

import type { ProgramStatusDto, ProgramTypeDto } from "../api/programs.api";

export type ProgramStatus = ProgramStatusDto;
export type ProgramType = ProgramTypeDto;
export type ProgramWorkflowStatus =
	| "DRAFT"
	| "REVIEW"
	| "APPROVED"
	| "ACTIVE"
	| "EXPIRED";

export interface ProgramRevision {
	id: number | null;
	label: string | null;
	major: number | null;
	minor: number | null;

	status: "DRAFT" | "ACTIVE" | "EXPIRED" | null;

	isMinorRevision: boolean;
	isSubmitted: boolean;
	approved: boolean;
}

export interface Program {
	id: number;
	identifier: string;
	name: string;

	status: ProgramStatus;
	type: ProgramType | null;

	revision: ProgramRevision | null;

	hasDraft: boolean;

	deliveryStartDate: string | null;
	deliveryEndDate: string | null;

	updatedAt: string | null;
}

export interface ProgramDetail extends Program {
	activeRevision: ProgramRevision | null;
	draftRevision: ProgramRevision | null;
}
export interface ProgramsStatusCounts {
	all: number;
	draft: number;
	review: number;
	approved: number;
	active: number;
	expired: number;
}

export interface ProgramsPagination {
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
}

export interface ProgramsList {
	items: Program[];
	pagination: ProgramsPagination;
	statusCounts: ProgramsStatusCounts;
}
