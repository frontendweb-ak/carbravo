import type { ProgramRevisionHistoryState } from "@/features/program/model/revisions.types";

import {
	Alert,
	Button,
	Card,
	CardContent,
	Chip,
	Paper,
	Stack,
	Typography,
} from "@mui/material";

interface ProgramRevisionHistoryProps {
	history: ProgramRevisionHistoryState;
	currentRevisionId: number | null;
	onViewRevision?: (revisionId: number) => void;
}

export function ProgramRevisionHistory({
	history,
	currentRevisionId,
	onViewRevision,
}: ProgramRevisionHistoryProps) {
	const previousRevisions = history.revisions.filter(
		(revision) => revision.id !== currentRevisionId,
	);

	return (
		<Card variant="outlined">
			<CardContent>
				<Stack spacing={3}>
					<Stack spacing={0.5}>
						<Typography variant="h6" sx={{ fontWeight: 600 }}>
							Revision History
						</Typography>

						<Typography variant="body2" color="text.secondary">
							Previously active revisions of this program. Open any revision to
							view its configuration in read-only mode.
						</Typography>
					</Stack>

					{previousRevisions.length === 0 ? (
						<Alert severity="info">No previous revisions available.</Alert>
					) : (
						<Stack spacing={2}>
							{previousRevisions.map((revision) => (
								<Paper
									key={revision.id}
									variant="outlined"
									sx={{
										p: 2,
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										gap: 2,
									}}
								>
									<Stack
										sx={{
											display: "flex",
											flexDirection: "row",
											gap: 2,
											alignItems: "center",
											flexWrap: "wrap",
										}}
									>
										<Chip
											label={`Rev ${revision.label}`}
											size="small"
											variant="outlined"
										/>

										<Chip
											label={revision.status}
											size="small"
											color="primary"
										/>

										<Typography variant="body2" color="text.secondary">
											{revision.postedAt
												? `Posted ${revision.postedAt}`
												: "Not posted"}
											{" • "}
											{revision.postedBy ?? revision.createdBy}
										</Typography>
									</Stack>

									<Button
										variant="outlined"
										size="small"
										onClick={() => onViewRevision?.(revision.id)}
									>
										View Read-Only
									</Button>
								</Paper>
							))}
						</Stack>
					)}
				</Stack>
			</CardContent>
		</Card>
	);
}