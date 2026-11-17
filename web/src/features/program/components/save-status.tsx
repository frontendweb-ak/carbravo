import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { Typography } from "@/components/ui";
import type { ProgramSaveStatus } from "../editor/program-editor-context";

export interface SaveStatusProps {
	status: ProgramSaveStatus;
	error?: string | null;
	hideSave?: boolean;
	saveDisabled?: boolean;
	saveLabel?: string;
	onSave?: () => void;
}

function getStatusMessage(status: ProgramSaveStatus, error?: string | null) {
	switch (status) {
		case "unsaved":
			return "Unsaved changes";
		case "saving":
			return "Saving...";
		case "saved":
			return "All changes saved";
		case "invalid":
			return "Fix validation errors";
		case "error":
			return error ? `Save failed: ${error}` : "Save failed. Try again.";
		default:
			return "Not saved yet";
	}
}

function getStatusColor(status: ProgramSaveStatus) {
	switch (status) {
		case "saved":
			return "success.main";
		case "unsaved":
			return "warning.main";
		case "invalid":
		case "error":
			return "error.main";
		default:
			return "text.secondary";
	}
}

function SaveStatus({
	status,
	error,
	hideSave = false,
	saveDisabled = false,
	saveLabel = "Save draft",
	onSave,
}: SaveStatusProps) {
	const isSaved = status === "saved";

	return (
		<Stack
			direction="row"
			sx={{ alignItems: "center", gap: 1.75, flexShrink: 0, minWidth: 0 }}
		>
			<Stack
				direction="row"
				sx={{ alignItems: "center", gap: 0.5, minWidth: 0 }}
				role="status"
				aria-live="polite"
			>
				{isSaved && (
					<CheckIcon
						aria-hidden
						sx={{ fontSize: 16, color: "success.main" }}
					/>
				)}
				<Typography
					sx={{
						fontSize: 12,
						fontWeight: 600,
						lineHeight: 1.3,
						color: getStatusColor(status),
					}}
				>
					{getStatusMessage(status, error)}
				</Typography>
			</Stack>

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
