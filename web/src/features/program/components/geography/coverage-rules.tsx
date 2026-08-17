import type { GeographyRule } from "../../schema";
import { ProgramSection } from "../program-section";

import { Box } from "@mui/material";
import { CoverageColumn } from "./coverage-column";

interface CoverageRulesProps {
	included: GeographyRule[];
	excluded: GeographyRule[];

	onRemoveInclude?: (index: number) => void;
	onRemoveExclude?: (index: number) => void;
}

export function CoverageRules({
	included,
	excluded,
	onRemoveInclude,
	onRemoveExclude,
}: CoverageRulesProps) {
	return (
		<ProgramSection title="Coverage Rules">
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: "1fr",
						md: "1fr 1fr",
					},
					gap: 3,
				}}
			>
				<CoverageColumn
					title="Included"
					rules={included}
					emptyMessage="At least one include rule is required."
					variant="include"
					onRemove={onRemoveInclude}
				/>

				<CoverageColumn
					title="Excluded"
					rules={excluded}
					emptyMessage="No exclusions."
					variant="exclude"
					onRemove={onRemoveExclude}
				/>
			</Box>
		</ProgramSection>
	);
}
