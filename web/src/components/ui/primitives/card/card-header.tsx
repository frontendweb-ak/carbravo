import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

export interface AppCardHeaderProps {
	title?: ReactNode;
	description?: ReactNode;
	action?: ReactNode;

	divider?: boolean;

	paddingX?: number;
	paddingY?: number;

	titleVariant?: React.ComponentProps<typeof Typography>["variant"];
	descriptionVariant?: React.ComponentProps<typeof Typography>["variant"];

	titleSx?: SxProps<Theme>;
	descriptionSx?: SxProps<Theme>;
	contentSx?: SxProps<Theme>;
	actionSx?: SxProps<Theme>;
	sx?: SxProps<Theme>;
}

function AppCardHeader({
	title,
	description,
	action,
	divider = true,
	paddingX = 3,
	paddingY = 2.5,
	titleVariant = "h6",
	descriptionVariant = "body2",
	titleSx,
	descriptionSx,
	contentSx,
	actionSx,
	sx,
}: AppCardHeaderProps) {
	if (title == null && description == null && action == null) {
		return null;
	}

	const headerSx: SxProps<Theme> = [
		{
			display: "flex",
			alignItems: "flex-start",
			justifyContent: "space-between",
			gap: 2,
			px: paddingX,
			py: paddingY,
		},

		...(divider
			? [
					{
						borderBottom: 1,
						borderColor: "divider",
					},
				]
			: []),

		...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
	];

	const contentStyles: SxProps<Theme> = [
		{
			flex: 1,
			minWidth: 0,
		},
		...(contentSx ? (Array.isArray(contentSx) ? contentSx : [contentSx]) : []),
	];

	const titleStyles: SxProps<Theme> = [
		{
			fontWeight: 700,
			lineHeight: 1.2,
		},
		...(titleSx ? (Array.isArray(titleSx) ? titleSx : [titleSx]) : []),
	];

	const descriptionStyles: SxProps<Theme> = [
		{
			mt: 0.5,
		},
		...(descriptionSx
			? Array.isArray(descriptionSx)
				? descriptionSx
				: [descriptionSx]
			: []),
	];

	const actionStyles: SxProps<Theme> = [
		{
			display: "flex",
			alignItems: "center",
			flexShrink: 0,
		},
		...(actionSx ? (Array.isArray(actionSx) ? actionSx : [actionSx]) : []),
	];

	return (
		<Box sx={headerSx}>
			<Box sx={contentStyles}>
				{title != null && (
					<Typography variant={titleVariant} sx={titleStyles}>
						{title}
					</Typography>
				)}

				{description != null && (
					<Typography
						variant={descriptionVariant}
						color="text.secondary"
						sx={descriptionStyles}
					>
						{description}
					</Typography>
				)}
			</Box>

			{action != null && <Box sx={actionStyles}>{action}</Box>}
		</Box>
	);
}

export { AppCardHeader };
