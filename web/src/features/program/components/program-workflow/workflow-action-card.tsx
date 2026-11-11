import { Button } from "@/components/ui";
import type { ProgramWorkflowStatus } from "@/config/constants";
import { Box, Stack, TextField } from "@mui/material";
import { useState } from "react";

import { RequirementWarning } from "./requirement-warning";
import type { WorkflowRequirement } from "./types";
import { WorkflowMessage } from "./workflow-message";

interface WorkflowActionCardProps {
  programId: number | undefined;
  revisionId?: number;
  status: ProgramWorkflowStatus;
  canSubmit: boolean;
  incompleteRequirements: WorkflowRequirement[];
  onSubmitForReview?: () => void;
  onApprove?: () => void;
  onReject?: (reason: string) => void;
  onPostToProduction?: () => void;
  onExpire?: () => void;
  loading: boolean;
}

function WorkflowActionCard({
  programId,
  revisionId,
  status,
  canSubmit,
  incompleteRequirements,
  onSubmitForReview,
  onApprove,
  onReject,
  onPostToProduction,
  onExpire,
  loading,
}: WorkflowActionCardProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const isDraft = status === "DRAFT";
  const isSubmitted = status === "REVIEW";
  const isApproved = status === "APPROVED";
  const isActive = status === "ACTIVE";
  const isExpired = status === "EXPIRED";

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
      {isDraft && (
        <>
          <Button
            color="primary"
            disabled={!canSubmit || loading || !onSubmitForReview}
            onClick={onSubmitForReview}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1,
            }}
          >
            Submit for review
          </Button>

          {incompleteRequirements.length > 0 && (
            <RequirementWarning
              programId={programId}
              revisionId={revisionId}
              items={incompleteRequirements}
            />
          )}
        </>
      )}

      {isSubmitted && (
        <>
          <WorkflowMessage
            title="Submitted for review"
            description="This program is waiting for approval."
          />

          {(onApprove || onReject) && (
            <Stack direction="row" spacing={1.25} sx={{ mt: 2, flexWrap: "wrap" }}>
              {onApprove && (
                <Button
                  color="success"
                  disabled={loading}
                  onClick={onApprove}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  Approve
                </Button>
              )}
              {onReject && (
                <Button
                  variant="outline"
                  color="error"
                  disabled={loading || rejectionReason.trim().length === 0}
                  onClick={() => onReject(rejectionReason.trim())}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  Reject
                </Button>
              )}
            </Stack>
          )}

          {onReject && (
            <TextField
              fullWidth
              multiline
              minRows={2}
              size="small"
              label="Rejection reason (required to reject)"
              placeholder="Explain what needs to change..."
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              disabled={loading}
              sx={{ mt: 2 }}
            />
          )}
        </>
      )}

      {isApproved && (
        <>
          <WorkflowMessage
            title="Program approved"
            description="The program has been approved and is ready to be posted to production."
          />

          {onPostToProduction && (
            <>
              {incompleteRequirements.length > 0 && (
                <RequirementWarning
                  programId={programId}
                  revisionId={revisionId}
                  items={incompleteRequirements}
                />
              )}
              <Button
                color="success"
                disabled={loading || !canSubmit}
                onClick={onPostToProduction}
                sx={{
                  mt: 2,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Post to production
              </Button>
            </>
          )}
        </>
      )}

      {isActive && (
        <>
          <WorkflowMessage
            title="Program is active"
            description="This program is currently available in production."
          />

          {onExpire && (
            <Button
              variant="outline"
              color="error"
              disabled={loading}
              onClick={onExpire}
              sx={{
                mt: 2,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Expire program
            </Button>
          )}
        </>
      )}

      {isExpired && (
        <WorkflowMessage
          title="Program expired"
          description="This program is no longer active."
        />
      )}
    </Box>
  );
}

export { WorkflowActionCard };
