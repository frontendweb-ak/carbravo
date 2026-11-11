import { Alert, Box } from "@mui/material";
import type { ProgramWorkflowStatus } from "@/config/constants";
import { ProgramWorkflow } from "@/features/program/components/program-workflow";
import { useProgramEditor } from "@/features/program/editor/program-editor-context";
import { useMockUserRole } from "@/infra/api/use-mock-user-role";
import {
  useApproveProgramRevision,
  useExpireProgram,
  usePostProgramRevision,
  useProgramApproval,
  useProgramGeography,
  useProgramSetup,
  useProgramValues,
  useProgramVehicles,
  useRejectProgramRevision,
  useSubmitProgramRevision,
} from "@/features/program";

export default function ApprovalPage() {
  const { programId, revisionId, programStatus } = useProgramEditor();
  const { role } = useMockUserRole();

  const approvalQuery = useProgramApproval(programId, revisionId);
  const setupQuery = useProgramSetup(programId, revisionId);
  const vehiclesQuery = useProgramVehicles(programId, revisionId);
  const geographyQuery = useProgramGeography(programId, revisionId);
  const valuesQuery = useProgramValues(programId, revisionId);

  const submitRevision = useSubmitProgramRevision();
  const approveRevision = useApproveProgramRevision();
  const rejectRevision = useRejectProgramRevision();
  const postRevision = usePostProgramRevision();
  const expireProgram = useExpireProgram();

  const approval = approvalQuery.data;
  const setup = setupQuery.data;
  const selectedVehicles = vehiclesQuery.data?.selectedVehicles ?? [];
  const geographyRules = geographyQuery.data?.geoRules ?? [];
  const components = valuesQuery.data?.components ?? [];

  const requirements = [
    {
      key: "setup" as const,
      label: "Setup",
      complete: Boolean(
        setup?.programName.trim() &&
          setup.programTypeCode.trim() &&
          setup.deliveryStartDate &&
          setup.deliveryEndDate &&
          setup.customerTypeCodes.length > 0 &&
          (setup.conditionTier || setup.conditionCode),
      ),
    },
    {
      key: "vehicles" as const,
      label: "Vehicles",
      complete: selectedVehicles.length > 0,
    },
    {
      key: "geography" as const,
      label: "Geography",
      complete: geographyRules.some((rule) => rule.isIncluded),
    },
    {
      key: "eligibility" as const,
      label: "Eligibility",
      complete: Boolean(setup?.customerTypeCodes.length && setup.financialProviderCode),
    },
    {
      key: "incentive-values" as const,
      label: "Incentive Values",
      complete: components.some((component) => component.attributes.length > 0),
    },
    {
      key: "marketing" as const,
      label: "Marketing & Disclosures",
      complete: Boolean(setup?.mfpnText?.trim() && setup.disclosureText?.trim()),
    },
  ];

  const status: ProgramWorkflowStatus = (() => {
    if (programStatus === "EXPIRED") return "EXPIRED";
    if (approval?.revisionStatus === "EXPIRED") return "EXPIRED";
    if (approval?.revisionStatus === "ACTIVE") return "ACTIVE";
    if (approval?.approved) return "APPROVED";
    if (approval?.isSubmitted) return "REVIEW";
    if (
      programStatus === "ACTIVE" ||
      programStatus === "APPROVED" ||
      programStatus === "REVIEW"
    ) {
      return programStatus;
    }
    return "DRAFT";
  })();

  const isLoading =
    approvalQuery.isLoading ||
    setupQuery.isLoading ||
    vehiclesQuery.isLoading ||
    geographyQuery.isLoading ||
    valuesQuery.isLoading ||
    submitRevision.isPending ||
    approveRevision.isPending ||
    rejectRevision.isPending ||
    postRevision.isPending ||
    expireProgram.isPending;

  const queryError =
    approvalQuery.isError ||
    setupQuery.isError ||
    vehiclesQuery.isError ||
    geographyQuery.isError ||
    valuesQuery.isError;

  const handleSubmit = () => {
    if (programId == null || revisionId == null) return;
    submitRevision.mutate({ programId, revisionId });
  };

  const handleApprove = () => {
    if (programId == null || revisionId == null) return;
    approveRevision.mutate({ programId, revisionId });
  };

  const handleReject = (rejectionReason: string) => {
    if (programId == null || revisionId == null || !rejectionReason.trim()) return;
    rejectRevision.mutate({
      programId,
      revisionId,
      payload: { rejectionReason: rejectionReason.trim() },
    });
  };

  const handlePostToProduction = () => {
    if (programId == null || revisionId == null) return;
    postRevision.mutate({ programId, revisionId });
  };

  const handleExpire = () => {
    if (programId == null) return;
    expireProgram.mutate({ programId });
  };

  return (
    <Box sx={{ width: "100%" }}>
      {queryError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Some workflow details could not be loaded. Retry the affected section before changing its approval state.
        </Alert>
      )}

      <ProgramWorkflow
        programId={programId}
        revisionId={revisionId}
        status={status}
        requirements={requirements}
        onSubmitForReview={status === "DRAFT" && (role === "AUTHOR" || role === "ADMIN") ? handleSubmit : undefined}
        onApprove={status === "REVIEW" && (role === "APPROVER" || role === "ADMIN") ? handleApprove : undefined}
        onReject={status === "REVIEW" && (role === "APPROVER" || role === "ADMIN") ? handleReject : undefined}
        onPostToProduction={status === "APPROVED" && (role === "AUTHOR" || role === "ADMIN") ? handlePostToProduction : undefined}
        onExpire={status === "ACTIVE" && role === "ADMIN" ? handleExpire : undefined}
        auditTimeline={approval?.auditTimeline ?? []}
        loading={isLoading}
      />
    </Box>
  );
}
