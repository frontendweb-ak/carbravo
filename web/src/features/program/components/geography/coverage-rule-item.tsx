import { Button, Chip, ListItem, ListItemText, Paper } from "@mui/material";

import type { GeographyRule } from "../../schema";

interface CoverageRuleItemProps {
	rule: GeographyRule;
	onRemove?: () => void;
}

export function CoverageRuleItem({ rule, onRemove }: CoverageRuleItemProps) {
	return (
		<ListItem
			component={Paper}
			variant="outlined"
			sx={{
				mb: 1,
				px: 2,
				py: 1,
				borderRadius: 2,
			}}
			secondaryAction={
				onRemove ? (
					<Button color="error" size="small" onClick={onRemove}>
						Remove
					</Button>
				) : undefined
			}
		>
			<ListItemText
				primary={rule.value}
				secondary={<Chip size="small" label={rule.level} variant="outlined" />}
			/>
		</ListItem>
	);
}
