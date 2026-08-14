// features/program/constants/messages.ts

export const PROGRAM_MESSAGES = {
	noDraftRevision: {
		title: "No draft revision available",
		description:
			"This program does not currently have a draft revision to edit.",
	},

	notFound: {
		title: "Program not found",
		description: "The program you're looking for could not be found.",
	},

	loadFailed: {
		title: "Failed to load program",
		description: "We couldn't load the program. Please try again.",
	},

	saveFailed: {
		title: "Failed to save program",
		description: "Your changes could not be saved. Please try again.",
	},
} as const;
