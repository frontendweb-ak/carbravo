import type { ListProgramsParams } from "@/features/program/api/programs.api";

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
		years: () => ["vehicles", "years"] as const,
		makes: (year: number) => ["vehicles", "makes", year] as const,
		models: (year: number, make: string) =>
			["vehicles", "models", year, make] as const,
		search: (params: Record<string, unknown>) =>
			["vehicles", "search", params] as const,
		selected: (programId: number, revisionId: number) =>
			["programs", programId, "revisions", revisionId, "vehicles"] as const,
	},
	geography: {
		regions: () => ["geography", "regions"] as const,
		states: (region?: string) => ["geography", "states", region] as const,
		dmas: (state: string, region?: string) =>
			["geography", "dmas", state, region] as const,
		counties: (state: string, dma?: string) =>
			["geography", "counties", state, dma] as const,
		search: (term: string) => ["geography", "search", term] as const,
		rules: (programId: number, revisionId: number) =>
			["programs", programId, "revisions", revisionId, "geography"] as const,
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
