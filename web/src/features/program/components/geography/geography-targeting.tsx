import { Button, Card, FormSelect } from "@/components/ui";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, CardContent, Stack, Typography } from "@mui/material";
import { type Control, type UseFormSetValue, useWatch } from "react-hook-form";
import {
	GEOGRAPHY_LEVEL_OPTIONS,
	GEOGRAPHY_VALUE_OPTIONS,
} from "../../constants/geography";
import type { GeographyFormValues, GeographyLevel } from "../../schema";

interface GeographyTargetingProps {
	control: Control<GeographyFormValues>;
	setValue: UseFormSetValue<GeographyFormValues>;
	onAdd: (mode: "include" | "exclude") => void;
}

export function GeographyTargeting({
	control,
	setValue,
	onAdd,
}: GeographyTargetingProps) {
	return (
		<Card variant="outlined">
			<CardContent>
				<Stack spacing={3}>
					<Box>
						<Typography variant="h6" sx={{ fontWeight: 700 }}>
							Geography Targeting
						</Typography>

						<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
							Combine include and exclude rules across the hierarchy — for
							example include National and exclude Texas.
						</Typography>
					</Box>

					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								md: "200px 1fr auto auto",
							},
							gap: 2,
							alignItems: "end",
						}}
					>
						<FormSelect
							control={control}
							name="currentRule.level"
							label="Level"
							options={GEOGRAPHY_LEVEL_OPTIONS}
						/>

						<GeographyValueSelect control={control} setValue={setValue} />

						<Button
							type="button"
							variant="success"
							soft
							onClick={() => onAdd("include")}
							startIcon={<AddIcon />}
						>
							Include
						</Button>

						<Button
							type="button"
							variant="danger"
							soft
							onClick={() => onAdd("exclude")}
							startIcon={<RemoveIcon />}
						>
							Exclude
						</Button>
					</Box>
				</Stack>
			</CardContent>
		</Card>
	);
}

interface GeographyValueSelectProps {
	control: Control<GeographyFormValues>;
	setValue: UseFormSetValue<GeographyFormValues>;
}

export function GeographyValueSelect({ control }: GeographyValueSelectProps) {
	const level = useWatch({
		control,
		name: "currentRule.level",
	});

	const options = GEOGRAPHY_VALUE_OPTIONS[level as GeographyLevel] ?? [];

	return (
		<FormSelect
			control={control}
			name="currentRule.value"
			label="Value"
			options={options}
		/>
	);
}
