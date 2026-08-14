import type {
	ActivityItemDto,
	DashboardStatusDto,
	DashboardSummaryDto,
	ExpiringProgramDto,
} from "../api/dashboard.api";
import { ACTIVITY_OPERATIONS } from "../constants";

import type {
	ActivityItem,
	DashboardProgramStatus,
	DashboardSummary,
	ExpiringProgram,
} from "./dashboard.types";

/**
 * API status -> application/UI status.
 *
 * Keep this conversion here so the rest of the application
 * never needs to know how the backend represents statuses.
 */
function mapDashboardStatus(
	status: DashboardStatusDto,
): DashboardProgramStatus {
	switch (status) {
		case "DRAFT":
			return "draft";

		case "ACTIVE":
			return "active";

		case "EXPIRED":
			return "expired";

		default:
			return "expired";
	}
}

/**
 * Dashboard summary
 */
export function mapDashboardSummary(
	dto: DashboardSummaryDto,
): DashboardSummary {
	return {
		counts: dto.counts.map((item) => ({
			status: mapDashboardStatus(item.status),
			total: item.total,
			pendingApproval: item.pendingApproval,
		})),
	};
}

/**
 * Activity
 */
export function mapActivityOperation(operation: string) {
	const mapped =
		ACTIVITY_OPERATIONS[operation as keyof typeof ACTIVITY_OPERATIONS];
	return {
		operation,
		operationLabel: mapped?.label ?? operation.toLowerCase(),
		color: mapped?.color,
	};
}

export function mapActivityItem(dto: ActivityItemDto): ActivityItem {
	const operation = mapActivityOperation(dto.operation);
	return {
		id: String(dto.id),

		entityType: dto.entityType,
		entityId: dto.entityId,

		actor: dto.changedBy,

		operation: operation.operation,
		operationLabel: operation.operationLabel,
		color: operation.color,

		changedAt: dto.changedAt,

		programName: dto.programName,
		programIdentifier: dto.programIdentifier,
	};
}

export function mapActivityItems(items: ActivityItemDto[]): ActivityItem[] {
	return items.map(mapActivityItem);
}

/**
 * Convert vehicle objects returned by the API
 * into the display string required by the dashboard.
 */
function formatVehicles(vehicles: ExpiringProgramDto["vehicles"]): string {
	if (vehicles.length === 0) {
		return "All vehicles";
	}

	return vehicles.map((vehicle) => vehicle.label).join(", ");
}

/**
 * Expiring-program API currently does NOT provide
 * an individual status.
 *
 * Therefore we should not derive a status from unrelated fields.
 */
function deriveExpiringProgramStatus(): ExpiringProgram["status"] {
	return "active";
}

/**
 * Expiring program
 */
export function mapExpiringProgram(dto: ExpiringProgramDto): ExpiringProgram {
	return {
		id: String(dto.programId),

		programId: dto.programId,
		programIdentifier: dto.programIdentifier,

		name: dto.programName,

		revisionId: dto.revisionId,
		revision: dto.revisionLabel,

		startsAt: dto.deliveryStartDate,
		expiresAt: dto.deliveryEndDate,

		vehicles: formatVehicles(dto.vehicles),

		includedStates: dto.includedStates,

		status: deriveExpiringProgramStatus(),
	};
}

export function mapExpiringPrograms(
	items: ExpiringProgramDto[],
): ExpiringProgram[] {
	return items.map(mapExpiringProgram);
}
