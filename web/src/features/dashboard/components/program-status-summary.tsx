import Box from "@mui/material/Box";

import { ProgramStatusCard } from "./program-status-card";

export interface ProgramStatusSummaryProps {
  draft: number;
  review: number;
  approved: number | null;
  active: number;
  expired: number;
  loading?: boolean;
}

function ProgramStatusSummary({
  draft,
  review,
  approved,
  active,
  expired,
  loading = false,
}: ProgramStatusSummaryProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(5, minmax(0, 1fr))",
        },
        columnGap: "14px",
        rowGap: "14px",
      }}
    >
      <ProgramStatusCard label="Draft" value={draft} href="/programs?workflowStatus=DRAFT" status="DRAFT" loading={loading} />
      <ProgramStatusCard label="Review" value={review} href="/programs?pendingApproval=true" status="REVIEW" loading={loading} />
      <ProgramStatusCard label="Approved" value={approved} href="/programs?workflowStatus=APPROVED" status="APPROVED" loading={loading} />
      <ProgramStatusCard label="Active" value={active} href="/programs?workflowStatus=ACTIVE" status="ACTIVE" loading={loading} />
      <ProgramStatusCard label="Expired" value={expired} href="/programs?workflowStatus=EXPIRED" status="EXPIRED" loading={loading} />
    </Box>
  );
}

export { ProgramStatusSummary };
