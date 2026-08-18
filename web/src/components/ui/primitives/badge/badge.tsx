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
					height: 24,
					borderRadius: 1,
					fontSize: 12,
					fontWeight: 600,

					...(tone === "neutral" && {
						backgroundColor: "action.hover",
						color: "text.secondary",
						borderColor: "divider",
					}),

					...(tone === "primary" && {
						backgroundColor: "primary.soft",
						color: "primary.softForeground",
						borderColor: "primary.softBorder",
					}),

					...(tone === "secondary" && {
						backgroundColor: "secondary.soft",
						color: "secondary.softForeground",
						borderColor: "secondary.softBorder",
					}),

					...(tone === "success" && {
						backgroundColor: "success.soft",
						color: "success.softForeground",
						borderColor: "success.softBorder",
					}),

					...(tone === "warning" && {
						backgroundColor: "warning.soft",
						color: "warning.softForeground",
						borderColor: "warning.softBorder",
					}),

					...(tone === "error" && {
						backgroundColor: "error.soft",
						color: "error.softForeground",
						borderColor: "error.softBorder",
					}),

					...(tone === "info" && {
						backgroundColor: "info.soft",
						color: "info.softForeground",
						borderColor: "info.softBorder",
					}),

					"& .MuiChip-label": {
						px: 1,
					},
				},

				...(Array.isArray(sx) ? sx : [sx]),
			]}
		/>
	);
}

export { Badge };
