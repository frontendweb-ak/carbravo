import { api } from "@/infra/axios/client";

export interface DashboardSummary {
	counts: Array<{
		status: "DRAFT" | "ACTIVE" | "EXPIRED";
		total: number;
		pendingApproval: number;
	}>;
}

export interface ActivityItem {
	id: number;
	entityType: "INCENTIVE_REVISION" | "INCENTIVE_PROGRAM";
	entityId: number;
	operation: string;
	changedBy: string;
	changedAt: string;
	programName: string;
	programIdentifier: string;
}

export interface ExpiringProgram {
	programId: number;
	programIdentifier: string;
	programName: string;
	revisionId: number;
	revisionLabel: string;
	deliveryStartDate: string;
	deliveryEndDate: string;
	vehicles: Array<{ vehicleCatalogId: number; label: string }>;
	includedStates: string[];
}

export class DashboardApi {
	static async getSummary(): Promise<DashboardSummary> {
		const response = await api.get<DashboardSummary>("/dashboard/summary");
		return response.data;
	}

	static async getActivity(): Promise<{ items: ActivityItem[] }> {
		const response = await api.get<{ items: ActivityItem[] }>(
			"/dashboard/activity",
		);
		return response.data;
	}

	static async getExpiringPrograms(): Promise<{ items: ExpiringProgram[] }> {
		const response = await api.get<{ items: ExpiringProgram[] }>(
			"/dashboard/expiring",
		);
		return response.data;
	}
}
