import type { ReactNode } from "react";

import { Badge, type BadgeProps } from "./badge";

export type Status =
	| "draft"
	| "review"
	| "approved"
	| "active"
	| "expired"
	| "success"
	| "warning"
	| "destructive"
	| "info"
	| "neutral";

export interface StatusBadgeProps extends Omit<
	BadgeProps,
	"variant" | "children"
> {
	status: Status;
	children?: ReactNode;
}

const statusLabels = {
	draft: "Draft",
	review: "Review",
	approved: "Approved",
	active: "Active",
	expired: "Expired",

	success: "Success",
	warning: "Warning",
	destructive: "Error",
	info: "Info",
	neutral: "Neutral",
} satisfies Record<Status, ReactNode>;

const statusVariants = {
	draft: "statusDraft",
	review: "statusReview",
	approved: "statusApproved",
	active: "statusActive",
	expired: "statusExpired",

	success: "success",
	warning: "warning",
	destructive: "destructive",
	info: "info",
	neutral: "outline",
} satisfies Record<Status, NonNullable<BadgeProps["variant"]>>;

function StatusBadge({
	status,
	children,
	size = "default",
	className,
	...props
}: StatusBadgeProps) {
	return (
		<Badge
			{...props}
			size={size}
			variant={statusVariants[status]}
			data-status={status}
			className={className}
		>
			{children ?? statusLabels[status]}
		</Badge>
	);
}

export { StatusBadge };
