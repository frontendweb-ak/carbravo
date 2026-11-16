import { Box, TextField, Typography } from "@mui/material";

import { ProgramSection } from "../components";
import { useProgramEditor } from "../editor/program-editor-context";

export function SummaryForm() {
  const {
    summaryDraft,
    setSummaryDraft,
    updateSectionStatus,
    isReadOnly,
  } = useProgramEditor();

  const handleSummaryChange = (value: string) => {
    setSummaryDraft(value);
    updateSectionStatus("summary", value.trim() ? "completed" : "warning");
  };

  return (
    <ProgramSection
      title="10-Point dealer summary"
      description="The plain-language summary dealers see. Describes how the program was authored."
    >
      <Box>
        <Typography
          component="label"
          htmlFor="dealer-summary"
          sx={{
            display: "block",
            mb: "6px",
            color: "text.secondary",
            fontSize: "10.5px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Summary
        </Typography>
        <TextField
          id="dealer-summary"
          fullWidth
          multiline
          minRows={8}
          value={summaryDraft}
          onChange={(event) => handleSummaryChange(event.target.value)}
          placeholder="Summarize the program for dealers…"
          disabled={isReadOnly}
          inputProps={{ "aria-describedby": "dealer-summary-status" }}
          sx={{
            "& .MuiOutlinedInput-root": {
              minHeight: "200px",
              alignItems: "flex-start",
              borderRadius: "9px",
              backgroundColor: "background.paper",
              padding: "9px 11px",
              fontFamily: "Mulish, system-ui, sans-serif",
              fontSize: "13.5px",
              lineHeight: 1.6,
            },
            "& .MuiOutlinedInput-input": {
              lineHeight: 1.6,
              padding: 0,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#D2DCDE",
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "8px" }}>
          <Typography
            id="dealer-summary-status"
            variant="caption"
            sx={{
              color: summaryDraft.length > 2000 ? "error.main" : "text.muted",
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: "11.5px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {summaryDraft.length} / 2000
          </Typography>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1 }}
        >
          Local draft only. The current API contract does not include a writable 10-point dealer-summary field, so this text is not saved to the program.
        </Typography>
      </Box>
    </ProgramSection>
  );
}
