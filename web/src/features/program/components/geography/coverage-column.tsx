import { List, Stack, Typography } from "@mui/material";

import type { GeographyRule } from "../../schema";
import { CoverageRuleItem } from "./coverage-rule-item";

interface CoverageColumnProps {
	title: string;
	rules: GeographyRule[];
	emptyMessage: string;
	variant: "include" | "exclude";
	onRemove?: (index: number) => void;
}

export function CoverageColumn({
	title,
	rules,
	emptyMessage,
	variant,
	onRemove,
}: CoverageColumnProps) {
	return (
		<Stack spacing={1.5}>
			<Typography
				variant="overline"
				color="text.secondary"
				sx={{ fontWeight: 700 }}
			>
				{title}
			</Typography>

			{rules.length === 0 ? (
				<Typography
					variant="body2"
					color={variant === "include" ? "warning.main" : "text.secondary"}
				>
					{emptyMessage}
				</Typography>
			) : (
				<List disablePadding>
					{rules.map((rule, index) => (
						<CoverageRuleItem
							key={rule.id}
							rule={rule}
							onRemove={onRemove ? () => onRemove(index) : undefined}
						/>
					))}
				</List>
			)}
		</Stack>
	);
}
