// src/features/program/components/program-identity-header.tsx

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { StatusBadge, Typography } from "@/components/ui";
import type { ProgramWorkflowStatus } from "@/config/constants";

export interface ProgramIdentityHeaderProps {
	backHref: string;
	backLabel?: ReactNode;

	name: ReactNode;
	type?: ReactNode;
	number?: ReactNode;
	revision?: ReactNode;

	status: ProgramWorkflowStatus;
}

function ProgramIdentityHeader({
	backHref,
	backLabel = "Programs",
	name,
	type,
	number,
	revision,
	status,
}: ProgramIdentityHeaderProps) {
	return (
		<Stack
			direction="row"
			sx={{
				alignItems: "center",
				minWidth: 0,
				gap: 1.25,
			}}
		>
			{/* Back */}
			<Link
				to={backHref}
				style={{
					flexShrink: 0,
					textDecoration: "none",
				}}
			>
				<Typography
					noWrap
					sx={{
						fontSize: 13,
						lineHeight: 1,
						fontWeight: 700,
						color: "#607984",

						"&:hover": {
							color: "#244B5A",
						},
					}}
				>
					{backLabel}
				</Typography>
			</Link>

			{/* Separator */}
			<Box
				component="span"
				aria-hidden
				sx={{
					width: "1px",
					height: 26,
					flex: "0 0 1px",
					backgroundColor: "#D7E0E3",
				}}
			/>

			{/* Program name */}
			<Box
				sx={{
					minWidth: 0,
					flex: "0 1 auto",
				}}
			>
				<Typography
					variant="h5"
					noWrap
					sx={{
						maxWidth: 420,

						overflow: "hidden",
						textOverflow: "ellipsis",

						fontSize: 18,
						lineHeight: 1,
						fontWeight: 800,

						color: "#244B5A",
					}}
				>
					{name}
				</Typography>
			</Box>

			{/* Type */}
			{type != null && (
				<Typography
					noWrap
					sx={{
						flexShrink: 0,

						fontSize: 11,
						lineHeight: 1,
						fontWeight: 500,

						color: "#8A9BA3",
					}}
				>
					{type}
				</Typography>
			)}

			{/* Number */}
			{number != null && (
				<>
					<Typography
						component="span"
						sx={{
							flexShrink: 0,

							fontSize: 11,
							lineHeight: 1,

							color: "#A0ADB3",
						}}
					>
						·
					</Typography>

					<Typography
						noWrap
						sx={{
							flexShrink: 0,

							fontSize: 11,
							lineHeight: 1,

							color: "#8A9BA3",
						}}
					>
						{number}
					</Typography>
				</>
			)}

			{/* Revision */}
			{revision != null && (
				<Box
					sx={{
						display: "inline-flex",
						alignItems: "center",

						flexShrink: 0,

						height: 26,
						px: 1.25,

						borderRadius: "7px",

						backgroundColor: "#E7EFF1",
					}}
				>
					<Typography
						noWrap
						sx={{
							fontSize: 11,
							lineHeight: 1,
							fontWeight: 700,

							color: "#244B5A",
						}}
					>
						Rev: {revision}
					</Typography>
				</Box>
			)}

			{/* Status */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",

					flexShrink: 0,
				}}
			>
				<StatusBadge status={status} />
			</Box>
		</Stack>
	);
}

export { ProgramIdentityHeader };
