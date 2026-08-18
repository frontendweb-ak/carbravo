// src/components/ui/composite/save-status/save-status.tsx

import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { Typography } from "@/components/ui";

export interface SaveStatusProps {
	saved?: boolean;
	hideSave?: boolean;
	saveDisabled?: boolean;
	saveLabel?: string;
	onSave?: () => void;
}

function SaveStatus({
	saved = false,
	hideSave = false,
	saveDisabled = false,
	saveLabel = "Save draft",
	onSave,
}: SaveStatusProps) {
	return (
		<Stack
			direction="row"
			sx={{ alignItems: "center", gap: 1.75, flexShrink: 0 }}
		>
			{saved && (
				<Stack
					direction="row"
					sx={{
						alignItems: "center",
						gap: 0.5,
						whiteSpace: "nowrap",
					}}
				>
					<CheckIcon
						aria-hidden
						sx={{
							fontSize: 16,
							color: "#5E9E3D",
						}}
					/>

					<Typography
						sx={{
							fontSize: 12,
							fontWeight: 600,
							lineHeight: 1,
							color: "#5E9E3D",
						}}
					>
						All changes saved
					</Typography>
				</Stack>
			)}

			{!hideSave && (
				<Button
					type="button"
					variant="outlined"
					disabled={saveDisabled}
					onClick={onSave}
					sx={{
						height: 36,
						minWidth: 99,
						px: 1.75,

						borderRadius: "10px",

						backgroundColor: "#FFFFFF",
						border: "1px solid #CFDCE0",

						color: "#355666",

						fontSize: 12,
						fontWeight: 700,
						textTransform: "none",

						boxShadow: "0 1px 2px rgba(16, 42, 56, 0.03)",

						"&:hover": {
							backgroundColor: "#FFFFFF",
							borderColor: "#B9C9CE",
						},

						"&.Mui-disabled": {
							backgroundColor: "#FFFFFF",
							borderColor: "#CFDCE0",
						},
					}}
				>
					{saveLabel}
				</Button>
			)}
		</Stack>
	);
}

export { SaveStatus };
