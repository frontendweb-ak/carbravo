import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ClipboardCheck, Plus, Search } from "lucide-react";

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
		<Paper
			elevation={0}
			sx={(theme) => ({
				p: 2.5,
				borderRadius: 3,
				backgroundColor: theme.palette.brandTeal.main,
				color: "#fff",
			})}
		>
			<Typography
				variant="subtitle1"
				sx={{
					fontWeight: 700,
				}}
			>
				Quick actions
			</Typography>

			<Typography
				variant="body2"
				sx={{
					mt: 0.5,
					opacity: 0.7,
				}}
			>
				Start or manage incentive programs
			</Typography>

			<Box
				sx={{
					mt: 2,
					display: "flex",
					flexDirection: "column",
					gap: 1,
				}}
			>
				<Button
					fullWidth
					variant="contained"
					startIcon={<Plus size={16} />}
					onClick={onNewProgram}
					sx={{
						justifyContent: "flex-start",
					}}
				>
					New program
				</Button>

				<Button
					fullWidth
					variant="outlined"
					startIcon={<Search size={16} />}
					onClick={onBrowsePrograms}
					sx={{
						justifyContent: "flex-start",
						borderColor: "rgba(255,255,255,0.2)",
						backgroundColor: "rgba(255,255,255,0.08)",
						color: "#fff",

						"&:hover": {
							borderColor: "rgba(255,255,255,0.2)",
							backgroundColor: "rgba(255,255,255,0.16)",
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
						justifyContent: "space-between",
						borderColor: "rgba(255,255,255,0.2)",
						backgroundColor: "rgba(255,255,255,0.08)",
						color: "#fff",

						"&:hover": {
							borderColor: "rgba(255,255,255,0.2)",
							backgroundColor: "rgba(255,255,255,0.16)",
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
						<ClipboardCheck size={16} />
						Review queue
					</Box>

					{reviewCount > 0 && (
						<Chip
							label={reviewCount}
							size="small"
							sx={{
								height: 22,
								backgroundColor: "rgba(255,255,255,0.2)",
								color: "#fff",
								fontWeight: 600,

								"& .MuiChip-label": {
									px: 1,
								},
							}}
						/>
					)}
				</Button>
			</Box>
		</Paper>
	);
}

export { QuickActions };
