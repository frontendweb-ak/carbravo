import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box } from "@mui/material";
import type { Program } from "../model/programs.types";
import { ProgramMobileContent } from "./program-mobile-content";
interface ProgramMobileCardProps {
	program: Program;
	onClick?: () => void;
}

export function ProgramMobileCard({
	program,
	onClick,
}: ProgramMobileCardProps) {
	if (!onClick) {
		return <ProgramMobileContent program={program} />;
	}

	return (
		<Box
			component="button"
			type="button"
			onClick={onClick}
			sx={{
				display: "flex",
				alignItems: "flex-start",
				width: "100%",
				gap: 2,
				p: 2,
				border: 0,
				backgroundColor: "transparent",
				color: "inherit",
				textAlign: "left",
				cursor: "pointer",
				font: "inherit",
				transition: "background-color 150ms ease",

				"&:hover": {
					backgroundColor: "action.hover",
				},

				"&:focus-visible": {
					outline: "none",
					boxShadow: (theme) => `inset 0 0 0 2px ${theme.palette.primary.main}`,
				},
			}}
		>
			<ProgramMobileContent program={program} />

			<ChevronRightIcon
				aria-hidden="true"
				sx={{
					mt: 0.5,
					width: 16,
					height: 16,
					flexShrink: 0,
					color: "text.secondary",
				}}
			/>
		</Box>
	);
}
