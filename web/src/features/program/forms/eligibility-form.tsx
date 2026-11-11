import { useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import {
  Button,
  FormCheckbox,
  FormChoiceChipGroup,
  FormSelect,
  FormTextarea,
  Typography,
} from "@/components/ui";
import { ProgramSection } from "../components";
import {
  CUSTOMER_TYPE_OPTIONS,
  eligibilityDefaultValues,
  FINANCIAL_PROVIDER_OPTIONS,
} from "../constants";
import { useProgramEditor } from "../editor/program-editor-context";
import { useProgramSetup, useUpdateProgramSetup } from "../hooks";
import { mapSetupResponseToDto } from "../model/setup.mapper";
import { type EligibilityFormValues, eligibilityFormSchema } from "../schema";

export function EligibilityForm() {
  const {
    programId,
    revisionId,
    isReadOnly,
    isMinorRevision,
    registerSaveHandler,
    setSectionSaving,
    updateSectionStatus,
  } = useProgramEditor();

  const setupQuery = useProgramSetup(programId, revisionId);
  const updateSetup = useUpdateProgramSetup();
  const canEdit = !isReadOnly && !isMinorRevision;

  const form = useForm<EligibilityFormValues>({
    resolver: zodResolver(eligibilityFormSchema),
    defaultValues: eligibilityDefaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (!setupQuery.data || form.formState.isDirty) return;
    form.reset({
      financialProviderCode: setupQuery.data.financialProviderCode ?? "",
      tierRate: false,
      customerTypeCodes: [...setupQuery.data.customerTypeCodes],
      footnotes: setupQuery.data.disclosureText ?? "",
    });
  }, [setupQuery.data, form]);

  const onSubmit = useCallback(async (values: EligibilityFormValues) => {
    if (!canEdit || programId == null || revisionId == null || !setupQuery.data) {
      return;
    }

    setSectionSaving(true);
    try {
      await updateSetup.mutateAsync({
        programId,
        revisionId,
        payload: {
          ...mapSetupResponseToDto(setupQuery.data),
          financialProviderCode: values.financialProviderCode || null,
          customerTypeCodes: [...values.customerTypeCodes],
          disclosureText: values.footnotes.trim() || null,
        },
      });
      updateSectionStatus("eligibility", "completed");
      form.reset(values);
    } finally {
      setSectionSaving(false);
    }
  }, [
    canEdit,
    form,
    programId,
    revisionId,
    setSectionSaving,
    setupQuery.data,
    updateSectionStatus,
    updateSetup,
  ]);

  useEffect(() => {
    registerSaveHandler(async () => {
      await form.handleSubmit(onSubmit)();
    });
    return () => registerSaveHandler(null);
  }, [form, onSubmit, registerSaveHandler]);

  return (
    <FormProvider {...form}>
      <Box
        component="form"
        onSubmit={form.handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        {isMinorRevision && (
          <Alert severity="info">
            Eligibility is locked for a minor revision. Minor revisions can update marketing text only.
          </Alert>
        )}

        <ProgramSection title="Financial provider">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
              gap: 2.5,
            }}
          >
            <FormSelect
              control={form.control}
              name="financialProviderCode"
              label="Provider"
              required
              options={FINANCIAL_PROVIDER_OPTIONS}
              disabled={!canEdit}
            />

            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", minWidth: 0 }}>
              <Typography variant="overline" sx={{ mb: 0.75, color: "text.secondary" }}>
                Tier rate
              </Typography>
              <Box sx={{ minHeight: 40, display: "flex", alignItems: "center" }}>
                <FormCheckbox
                  control={form.control}
                  name="tierRate"
                  variant="inline"
                  disabled
                  label={<>Apply tier-based rate structure <Box component="span" sx={{ color: "warning.main", fontWeight: 700 }}>(TBD)</Box></>}
                />
              </Box>
            </Box>
          </Box>
        </ProgramSection>

        <ProgramSection
          title="Customer type"
          description="Who is eligible for this program."
          headerAction={
            <Button
              type="button"
              variant="outline"
              size="small"
              disabled={!canEdit}
              onClick={() => {
                const allValues = CUSTOMER_TYPE_OPTIONS.map((option) => option.value);
                const currentValues = form.getValues("customerTypeCodes");
                form.setValue(
                  "customerTypeCodes",
                  currentValues.length === allValues.length ? [] : allValues,
                  { shouldDirty: true, shouldValidate: false },
                );
              }}
            >
              {form.watch("customerTypeCodes").length === CUSTOMER_TYPE_OPTIONS.length
                ? "Clear all"
                : "Select all"}
            </Button>
          }
        >
          <FormChoiceChipGroup
            control={form.control}
            borderRadius={5}
            name="customerTypeCodes"
            label="Customer type"
            required
            selectionMode="multiple"
            options={CUSTOMER_TYPE_OPTIONS}
            disabled={!canEdit}
          />
        </ProgramSection>

        <ProgramSection
          title="Eligibility footnotes"
          description="The current API contract stores these in the shared disclosureText field also used by Marketing & Disclosures."
        >
          <FormTextarea
            control={form.control}
            name="footnotes"
            label="Footnotes / disclosure"
            required
            placeholder="Enter eligibility and legal disclosure text..."
            maxLength={2000}
            showCounter
            disabled={!canEdit}
          />
        </ProgramSection>

        {!canEdit && !isMinorRevision && (
          <Alert severity="info">This revision is read-only.</Alert>
        )}
      </Box>
    </FormProvider>
  );
}
