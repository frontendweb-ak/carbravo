import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import type { ImgHTMLAttributes } from "react";
import { Typography } from "../ui";

export interface LogoProps extends Omit<
	ImgHTMLAttributes<HTMLImageElement>,
	"src" | "alt"
> {
	/**
	 * Logo height.
	 * Width is automatically calculated from the SVG aspect ratio.
	 */
	size?: number | string;
	alt?: string;
}

function Logo({ size = 28, alt = "CarBravo", style, ...props }: LogoProps) {
	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
			<Box
				component="img"
				src="/logo.svg"
				alt={alt}
				sx={{
					display: "block",
					width: "auto",
					height: size,
					objectFit: "contain",
					...style,
				}}
				{...props}
			/>

			<Divider
				orientation="vertical"
				flexItem
				sx={{ height: 24, alignSelf: "center", borderColor: "divider" }}
			/>

			<Typography
				component="span"
				sx={{
					fontSize: 12,
					fontWeight: 700,
					letterSpacing: "0.18em",
					textTransform: "uppercase",
					color: "text.secondary",
					lineHeight: 1,
					textDecoration: "none",
				}}
			>
				Incentives
			</Typography>
		</Box>
	);
}

export { Logo };

