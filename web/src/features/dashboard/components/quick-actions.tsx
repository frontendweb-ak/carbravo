import AddIcon from "@mui/icons-material/Add";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { Card } from "@/components/ui";

export interface QuickActionsProps {
	onNewProgram?: () => void;
	onBrowsePrograms?: () => void;
	onReviewQueue?: () => void;
	reviewCount?: number;
}

function QuickActions({
	onNewProgram,
	onBrowsePrograms,
	onReviewQueue,
	reviewCount = 0,
}: QuickActionsProps) {
	return (
		<Card
			variant="flat"
			elevation={0}
			sx={(theme) => ({
				width: "100%",
				maxWidth: 504,
				p: 4,
				borderRadius: "18px",
				backgroundColor: theme.palette.brandTeal.main,
				color: "#fff",
				boxShadow: "0 8px 20px rgba(24, 67, 76, 0.16)",
			})}
		>
			<Typography
				sx={{
					fontSize: 16,
					fontWeight: 700,
					lineHeight: 1.25,
					letterSpacing: 0,
				}}
			>
				Quick actions
			</Typography>

			<Typography
				sx={{
					mt: 0.5,
					fontSize: 13,
					fontWeight: 400,
					lineHeight: 1.35,
					color: "rgba(255,255,255,0.72)",
				}}
			>
				Start or manage incentive programs
			</Typography>

			<Box
				sx={{
					mt: 4,
					display: "flex",
					flexDirection: "column",
					gap: 2,
				}}
			>
				<Button
					fullWidth
					variant="contained"
					startIcon={<AddIcon />}
					onClick={onNewProgram}
					sx={{
						minHeight: 44,
						height: 44,
						px: 2,
						borderRadius: "11px",
						justifyContent: "flex-start",
						backgroundColor: "#6DBB3F",
						color: "#fff",
						fontSize: 14,
						fontWeight: 700,
						lineHeight: 1,

						"& .MuiButton-startIcon": {
							marginLeft: 0,
							marginRight: 1,
							"& svg": {
								fontSize: 16,
							},
						},

						"&:hover": {
							backgroundColor: "#6DBB3F",
						},
					}}
				>
					New program
				</Button>

				<Button
					fullWidth
					variant="outlined"
					startIcon={<SearchIcon />}
					onClick={onBrowsePrograms}
					sx={{
						minHeight: 44,
						height: 44,
						px: 2,
						borderRadius: "11px",
						justifyContent: "flex-start",
						border: "1px solid rgba(255,255,255,0.20)",
						backgroundColor: "rgba(255,255,255,0.08)",
						color: "#fff",
						fontSize: 14,
						fontWeight: 700,
						lineHeight: 1,

						"& .MuiButton-startIcon": {
							marginLeft: 0,
							marginRight: 1,
							"& svg": {
								fontSize: 15,
							},
						},

						"&:hover": {
							borderColor: "rgba(255,255,255,0.20)",
							backgroundColor: "rgba(255,255,255,0.14)",
						},
					}}
				>
					Browse all programs
				</Button>

				<Button
					fullWidth
					variant="outlined"
					onClick={onReviewQueue}
					sx={{
						minHeight: 47,
						height: 47,
						px: 2,
						borderRadius: "11px",
						justifyContent: "space-between",
						border: "1px solid rgba(255,255,255,0.20)",
						backgroundColor: "rgba(255,255,255,0.08)",
						color: "#fff",
						fontSize: 14,
						fontWeight: 700,
						lineHeight: 1,

						"&:hover": {
							borderColor: "rgba(255,255,255,0.20)",
							backgroundColor: "rgba(255,255,255,0.14)",
						},
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
						}}
					>
						<AssignmentTurnedInOutlinedIcon
							sx={{
								fontSize: 15,
							}}
						/>

						<Box component="span">Review queue</Box>
					</Box>

					{reviewCount > 0 && (
						<Chip
							label={reviewCount}
							size="small"
							sx={{
								height: 22,
								minWidth: 25,
								borderRadius: "11px",
								backgroundColor: "rgba(255,255,255,0.20)",
								color: "#fff",
								fontSize: 12,
								fontWeight: 700,

								"& .MuiChip-label": {
									px: 0.8,
								},
							}}
						/>
					)}
				</Button>
			</Box>
		</Card>
	);
}

export { QuickActions };
