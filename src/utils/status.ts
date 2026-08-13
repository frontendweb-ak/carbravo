// src/utils/status.ts

import type { ProgramStatus } from "@/features/program/model/program.types";

export const GENERAL_STATUSES = [
	"success",
	"warning",
	"destructive",
	"info",
	"neutral",
] as const;

export type GeneralStatus = (typeof GENERAL_STATUSES)[number];

export type Status = ProgramStatus | GeneralStatus;

export const STATUS_LABELS: Record<Status, string> = {
	draft: "Draft",
	review: "Review",
	approved: "Approved",
	active: "Active",
	expired: "Expired",

	success: "Success",
	warning: "Warning",
	destructive: "Error",
	info: "Info",
	neutral: "Neutral",
};

export const STATUS_BADGE_VARIANTS = {
	draft: "statusDraft",
	review: "statusReview",
	approved: "statusApproved",
	active: "statusActive",
	expired: "statusExpired",

	success: "success",
	warning: "warning",
	destructive: "destructive",
	info: "info",
	neutral: "outline",
} as const;

export function getStatusLabel(status: Status): string {
	return STATUS_LABELS[status];
}

// export function isProgramStatus(status: string): status is ProgramStatus {
// 	return PROGRAM_STATUSES.includes(status as ProgramStatus);
// }
