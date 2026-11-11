import { Typography } from "@/components/ui";
import { Box, Stack } from "@mui/material";

import type { ApprovalAuditEventDto } from "../../api/revisions.api";

const OPERATION_LABELS: Record<ApprovalAuditEventDto["operation"], string> = {
  CREATE: "Created revision",
  UPDATE: "Updated revision",
  SUBMIT: "Submitted for review",
  APPROVE: "Approved",
  REJECT: "Rejected",
  REVISE: "Created major revision",
  MINOR_REVISE: "Created minor revision",
  POST_TO_PRODUCTION: "Posted to production",
  EXPIRE: "Program expired",
};

function formatTimestamp(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function WorkflowTimeline({
  auditTimeline,
}: {
  auditTimeline: ApprovalAuditEventDto[];
}) {
  const events = [...auditTimeline].sort(
    (left, right) =>
      new Date(left.changedAt).getTime() - new Date(right.changedAt).getTime(),
  );

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "control.border",
        borderRadius: 2,
        backgroundColor: "background.paper",
        p: 2.5,
      }}
    >
      <Typography variant="body" weight="bold">
        Audit timeline
      </Typography>

      <Typography variant="bodyMedium" color="secondary" sx={{ mt: 0.25 }}>
        Every state transition, actor and time.
      </Typography>

      {events.length === 0 ? (
        <Typography variant="bodySmall" color="secondary" sx={{ mt: 2 }}>
          No audit events recorded yet.
        </Typography>
      ) : (
        <Stack spacing={0} sx={{ mt: 2 }}>
          {events.map((event, index) => (
            <Box
              key={`${event.operation}-${event.changedAt}-${event.changedBy}-${event.comment ?? ""}`}
              sx={{ display: "flex", gap: 1.5, minHeight: 54 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 10,
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    mt: 0.6,
                    borderRadius: "50%",
                    backgroundColor: index === events.length - 1 ? "success.main" : "control.border",
                    flexShrink: 0,
                  }}
                />
                {index < events.length - 1 && (
                  <Box sx={{ width: 2, flex: 1, mt: 0.5, backgroundColor: "control.border" }} />
                )}
              </Box>

              <Box sx={{ pb: 2 }}>
                <Typography variant="body" weight="bold">
                  {OPERATION_LABELS[event.operation]}
                </Typography>

                <Typography variant="bodySmall" color="secondary" sx={{ mt: 0.25 }}>
                  {event.changedBy} · {formatTimestamp(event.changedAt)}
                </Typography>

                {event.comment && (
                  <Typography variant="bodySmall" color="secondary" sx={{ mt: 0.5 }}>
                    {event.comment}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export { WorkflowTimeline };
