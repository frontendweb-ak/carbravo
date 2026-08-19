import type {
	GeographyCountiesParams,
	GeographyDmasParams,
	GeographySearchParams,
	GeographyStatesParams,
} from "@/features/program/api/geography.api";
import type { ListProgramsParams } from "@/features/program/api/programs.api";
import type { SearchVehiclesParams } from "@/features/program/api/vehicles.api";

export const queryKeys = {
	dashboard: {
		all: ["dashboard"] as const,
		summary: () => [...queryKeys.dashboard.all, "summary"] as const,
		activity: () => [...queryKeys.dashboard.all, "activity"] as const,
		expiring: () => [...queryKeys.dashboard.all, "expiring"] as const,
	},
	programs: {
		all: ["programs"] as const,
		list: (filters?: ListProgramsParams) =>
			[...queryKeys.programs.all, "list", filters] as const,
		detail: (id: number) => [...queryKeys.programs.all, "detail", id] as const,
		revisions: (programId: number) =>
			[...queryKeys.programs.all, programId, "revisions"] as const,
		revisionDetail: (programId: number, revisionId: number) =>
			[
				...queryKeys.programs.revisions(programId),
				revisionId,
				"detail",
			] as const,
		revisionDelta: (programId: number, revisionId: number) =>
			[
				...queryKeys.programs.revisions(programId),
				revisionId,
				"delta",
			] as const,
	},
	setup: {
		reference: () => ["reference", "setup"] as const,
		byRevision: (programId: number, revisionId: number) =>
			["programs", programId, "revisions", revisionId, "setup"] as const,
	},
	vehicles: {
		all: ["vehicles"] as const,
		years: () => ["vehicles", "years"] as const,
		makes: (year: number) => ["vehicles", "makes", year] as const,
		models: (year: number, make: string) =>
			["vehicles", "models", year, make] as const,
		search: (params: SearchVehiclesParams) =>
			["vehicles", "search", params] as const,
		byRevision: (programId: number, revisionId: number) =>
			["programs", programId, "revisions", revisionId, "vehicles"] as const,
		segments: () => ["vehicles", "segments"] as const,
	},
	geography: {
		all: ["geography"] as const,
		regions: () => [...queryKeys.geography.all, "regions"] as const,
		states: (params?: GeographyStatesParams) =>
			[...queryKeys.geography.all, "states", params] as const,
		dmas: (params?: GeographyDmasParams) =>
			[...queryKeys.geography.all, "dmas", params] as const,
		counties: (params?: GeographyCountiesParams) =>
			[...queryKeys.geography.all, "counties", params] as const,
		search: (params?: GeographySearchParams) =>
			[...queryKeys.geography.all, "search", params] as const,
		byRevision: (programId: number, revisionId: number) =>
			[
				...queryKeys.geography.all,
				"program",
				programId,
				"revision",
				revisionId,
			] as const,
	},
	values: {
		byRevision: (programId: number, revisionId: number) =>
			["programs", programId, "revisions", revisionId, "values"] as const,
	},
	summary: {
		byRevision: (programId: number, revisionId: number) =>
			["programs", programId, "revisions", revisionId, "summary"] as const,
	},
	approval: {
		byRevision: (programId: number, revisionId: number) =>
			["programs", programId, "revisions", revisionId, "approval"] as const,
	},
};
