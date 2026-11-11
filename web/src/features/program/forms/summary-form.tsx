import { Alert, Card, CardContent, Grid, Stack, Typography, Box } from "@mui/material";

import { ProgramSection } from "../components";
import { useProgramEditor } from "../editor/program-editor-context";
import { useProgramSummary } from "../hooks";

function SummaryValue({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
        {value || "—"}
      </Typography>
    </Box>
  );
}

export function SummaryForm() {
  const { programId, revisionId } = useProgramEditor();
  const summaryQuery = useProgramSummary(programId, revisionId);
  const summary = summaryQuery.data;

  return (
    <Stack spacing={2.5}>
      <ProgramSection
        title="10-Point dealer summary"
        description="The plain-language summary dealers see. Describes how the program was authored."
      >
        <Alert severity="warning" sx={{ mb: 2 }}>
          The current OpenAPI contract does not define a writable 10-point dealer-summary field or endpoint. This preview cannot be saved by the Hono mock API; the API-backed program overview below is read-only.
        </Alert>
        <Box
          sx={{
            minHeight: 160,
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1.5,
            backgroundColor: "action.hover",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            A persistent 10-point dealer summary requires an additional field in the OpenAPI contract and the future Java service.
          </Typography>
        </Box>
      </ProgramSection>

      <ProgramSection title="Program overview" description="Read-only data assembled from the current revision API.">
        {summaryQuery.isLoading ? (
          <Typography variant="body2" color="text.secondary">Loading program overview…</Typography>
        ) : summaryQuery.isError ? (
          <Alert severity="error">The program overview could not be loaded. Retry this section.</Alert>
        ) : summary ? (
          <Stack spacing={2.5}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Program and revision</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SummaryValue label="Program" value={summary.program.programName} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <SummaryValue label="Program ID" value={summary.program.programIdentifier} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <SummaryValue label="Revision" value={summary.revision.revisionLabel} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <SummaryValue label="Program type" value={summary.setup.programTypeCode} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <SummaryValue label="Customer type" value={summary.setup.customerTypeCode} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <SummaryValue label="Status" value={summary.program.programStatus} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SummaryValue label="Delivery start" value={summary.setup.deliveryStartDate ?? "—"} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SummaryValue label="Delivery end" value={summary.setup.deliveryEndDate ?? "—"} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Targeting and incentive values</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <SummaryValue label="Vehicles" value={String(summary.vehicles.length)} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <SummaryValue label="Geography rules" value={String(summary.geoRules.length)} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <SummaryValue label="Incentive components" value={String(summary.components.length)} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Marketing and disclosures</Typography>
                <Stack spacing={1.5}>
                  <SummaryValue label="MFPN" value={summary.mfpnText} />
                  <SummaryValue label="Disclosure" value={summary.disclosureText} />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">No API-backed summary is available for this revision.</Typography>
        )}
      </ProgramSection>
    </Stack>
  );
}
