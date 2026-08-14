import { http } from "@/infra/api";

import {
	mapActivityItems,
	mapDashboardSummary,
	mapExpiringPrograms,
} from "../model/dashboard.mapper";

import type {
	ActivityItem,
	DashboardSummary,
	ExpiringProgram,
} from "../model/dashboard.types";

/**
 * ============================================================
 * API DTOs
 * ============================================================
 *
 * These types represent the API contract.
 *
 * IMPORTANT:
 * Do not use frontend/domain types here.
 * These should match OpenAPI / Java API exactly.
 */

/**
 * Status values returned by the backend.
 *
 * This is intentionally uppercase because that is
 * what the OpenAPI contract currently defines.
 */
export type DashboardStatusDto = "DRAFT" | "ACTIVE" | "EXPIRED";
export type DashboardEventTypeDto = "INCENTIVE_REVISION" | "INCENTIVE_PROGRAM";
export interface DashboardSummaryDto {
	counts: Array<{
		status: DashboardStatusDto;
		total: number;
		pendingApproval: number;
	}>;
}

export interface ActivityItemDto {
	id: number;
	entityType: DashboardEventTypeDto;
	entityId: number;
	operation: string;
	changedBy: string;
	changedAt: string;
	programName: string;
	programIdentifier: string;
}

export interface ExpiringProgramDto {
	programId: number;
	programIdentifier: string;
	programName: string;
	revisionId: number;
	revisionLabel: string;
	deliveryStartDate: string;
	deliveryEndDate: string;
	vehicles: Array<{
		vehicleCatalogId: number;
		label: string;
	}>;
	includedStates: string[];
}

/**
 * ============================================================
 * API
 * ============================================================
 */

export const dashboardApi = {
	async getSummary(): Promise<DashboardSummary> {
		const response = await http.get<DashboardSummaryDto>("/dashboard/summary");


		return mapDashboardSummary(response.data);
	},

	async getActivity(): Promise<{
		items: ActivityItem[];
	}> {
		const response = await http.get<{
			items: ActivityItemDto[];
		}>("/dashboard/activity");

		return {
			items: mapActivityItems(response.data.items),
		};
	},

	async getExpiringPrograms(): Promise<{
		items: ExpiringProgram[];
	}> {
		const response = await http.get<{
			items: ExpiringProgramDto[];
		}>("/dashboard/expiring");

		return {
			items: mapExpiringPrograms(response.data.items),
		};
	},
};
