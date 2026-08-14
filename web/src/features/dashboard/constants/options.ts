export const ACTIVITY_OPERATIONS = {
	CREATE: { label: "created draft", color: "draft" },
	UPDATE: { label: "updated", color: "draft" },
	REVISE: { label: "revised", color: "review" },
	SUBMIT: { label: "submitted", color: "review" },
	APPROVE: { label: "approved", color: "approved" },
	POST_TO_PRODUCTION: { label: "published", color: "active" },
} as const;
