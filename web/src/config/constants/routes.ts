export const ROUTES = {
	dashboard: "/dashboard",
	programs: "/programs",
	programNew: "/programs/new",
	programDetail: (programId: string) => `/programs/${programId}`,
	programEdit: (programId: string) => `/programs/${programId}/edit`,
	programEditor: (programId: string, section: string) =>
		`/programs/${programId}/edit/${section}`,
} as const;
