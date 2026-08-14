// src/lib/status.ts

export type AppStatus = "draft" | "review" | "approved" | "active" | "expired";
export const STATUS_CONFIG = {
	draft: {
		label: "Draft",
		dot: "bg-status-draft",
		text: "text-status-draft",
	},
	review: {
		label: "Review",
		dot: "bg-status-review",
		text: "text-status-review",
	},
	approved: {
		label: "Approved",
		dot: "bg-status-approved",
		text: "text-status-approved",
	},
	active: {
		label: "Active",
		dot: "bg-status-active",
		text: "text-status-active",
	},
	expired: {
		label: "Expired",
		dot: "bg-status-expired",
		text: "text-status-expired",
	},
} as const;
