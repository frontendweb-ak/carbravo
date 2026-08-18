import Chip, { type ChipProps as MuiChipProps } from "@mui/material/Chip";

export type BadgeTone =
	| "neutral"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "error"
	| "info"
	| "draft"
	| "review"
	| "approved"
	| "active"
	| "expired";

export interface BadgeProps extends Omit<
	MuiChipProps,
	"color" | "variant" | "label" | "children"
> {
	children?: React.ReactNode;
	tone?: BadgeTone;
}

function Badge({ children, tone = "neutral", sx, ...props }: BadgeProps) {
	return (
		<Chip
			{...props}
			label={children}
			size="small"
			sx={[
				{
					height: 22,
					borderRadius: 999,
					fontSize: 11,
					fontWeight: 700,
					lineHeight: 1,

					"& .MuiChip-label": {
						px: 1.25,
					},

					// generic
					...(tone === "neutral" && {
						bgcolor: "action.hover",
						color: "text.secondary",
					}),

					...(tone === "primary" && {
						bgcolor: "primary.soft",
						color: "primary.softForeground",
					}),

					...(tone === "secondary" && {
						bgcolor: "secondary.soft",
						color: "secondary.softForeground",
					}),

					...(tone === "success" && {
						bgcolor: "success.soft",
						color: "success.softForeground",
					}),

					...(tone === "warning" && {
						bgcolor: "warning.soft",
						color: "warning.softForeground",
					}),

					...(tone === "error" && {
						bgcolor: "error.soft",
						color: "error.softForeground",
					}),

					...(tone === "info" && {
						bgcolor: "info.soft",
						color: "info.softForeground",
					}),

					// Dashboard statuses
					...(tone === "draft" && {
						bgcolor: "info.soft",
						color: "info.softForeground",
					}),

					...(tone === "review" && {
						bgcolor: "warning.soft",
						color: "warning.softForeground",
					}),

					...(tone === "approved" && {
						bgcolor: "rgba(0,131,132,0.12)",
						color: "#008384",
					}),

					...(tone === "active" && {
						bgcolor: "success.soft",
						color: "success.softForeground",
					}),

					...(tone === "expired" && {
						bgcolor: "action.hover",
						color: "text.secondary",
					}),
				},

				...(Array.isArray(sx) ? sx : [sx]),
			]}
		/>
	);
}

export { Badge };

