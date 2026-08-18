import { Box, Card, CardContent, LinearProgress } from "@mui/material";

import type { Program } from "../model/programs.types";
import { ProgramMobileCard } from "./program-mobile-card";
import { ProgramTable } from "./program-table";

export interface ProgramListProps {
	programs: Program[];
	isFetching?: boolean;
	onProgramClick?: (programId: number) => void;
	onClone?: (programId: number) => void;
}

function ProgramList({
	programs,
	isFetching = false,
	onProgramClick,
	onClone,
}: ProgramListProps) {
	return (
		<Card variant="outlined" sx={{ overflow: "hidden" }}>
			<CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
				{/* Keep current content visible while fetching */}
				{isFetching && (
					<LinearProgress
						aria-hidden="true"
						variant="indeterminate"
						sx={{ height: 2 }}
					/>
				)}

				<ProgramTable
					programs={programs}
					onClone={onClone}
					onProgramClick={onProgramClick}
				/>

				<Box
					sx={{
						display: { xs: "block", md: "none" },
						"& > * + *": {
							borderTop: 1,
							borderColor: "divider",
						},
					}}
				>
					{programs.map((program) => (
						<ProgramMobileCard
							key={program.id}
							program={program}
							onClick={
								onProgramClick ? () => onProgramClick(program.id) : undefined
							}
						/>
					))}
				</Box>
			</CardContent>
		</Card>
	);
}

export { ProgramList };
