import type {
	ActivityItemDto,
	DashboardSummaryDto,
	ExpiringProgramDto,
} from "../api/dashboard.api";

import { ACTIVITY_OPERATIONS } from "../constants";

import type {
	ActivityItem,
	DashboardSummary,
	ExpiringProgram,
} from "./dashboard.types";

/* -------------------------------------------------------------------------- */
/* Dashboard summary                                                          */
/* -------------------------------------------------------------------------- */

export function mapDashboardSummary(
	dto: DashboardSummaryDto,
): DashboardSummary {
	return {
		counts: dto.counts.map((item) => ({
			status: item.status,
			total: item.total,
		})),
	};
}

/* -------------------------------------------------------------------------- */
/* Activity                                                                   */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Expiring programs                                                          */
/* -------------------------------------------------------------------------- */

function formatVehicles(vehicles: ExpiringProgramDto["vehicles"]): string {
	if (vehicles.length === 0) {
		return "All vehicles";
	}

	return vehicles.map((vehicle) => vehicle.label).join(", ");
}

function deriveExpiringProgramStatus(): ExpiringProgram["status"] {
	return "ACTIVE";
}

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