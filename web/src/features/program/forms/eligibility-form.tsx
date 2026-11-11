import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
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
import { mergeSetupResponseToDto } from "../model/setup.mapper";
import { type EligibilityFormValues, eligibilityFormSchema } from "../schema";

export function EligibilityForm() {
  const {
    programId,
    revisionId,
    isReadOnly,
    registerSaveHandler,
    updateSectionStatus,
    setSectionSaving,
  } = useProgramEditor();

  const setupQuery = useProgramSetup(programId, revisionId);
  const updateSetup = useUpdateProgramSetup();
  const hydratedRevisionRef = useRef<string | null>(null);

  const form = useForm<EligibilityFormValues>({
    resolver: zodResolver(eligibilityFormSchema),
    defaultValues: eligibilityDefaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (!setupQuery.data || programId == null || revisionId == null) return;
    const key = `${programId}:${revisionId}`;
    if (hydratedRevisionRef.current === key) return;

    hydratedRevisionRef.current = key;
    form.reset({
      financialProviderCode: setupQuery.data.financialProviderCode ?? "",
      tierRate: false,
      customerTypeCodes: [...setupQuery.data.customerTypeCodes],
      footnotes: "",
    });
    updateSectionStatus("eligibility", "completed");
  }, [setupQuery.data, programId, revisionId, form, updateSectionStatus]);

  useEffect(() => {
    if (setupQuery.isError) updateSectionStatus("eligibility", "warning");
  }, [setupQuery.isError, updateSectionStatus]);

  const save = useCallback(async () => {
    if (isReadOnly || programId == null || revisionId == null || !setupQuery.data) return;

    const isValid = await form.trigger();
    if (!isValid) {
      updateSectionStatus("eligibility", "warning");
      return;
    }

    const values = form.getValues();
    setSectionSaving(true);
    try {
      const payload = mergeSetupResponseToDto(setupQuery.data, {
        financialProviderCode: values.financialProviderCode,
        customerTypeCodes: [...values.customerTypeCodes],
      });
      await updateSetup.mutateAsync({ programId, revisionId, payload });
      form.reset(values);
      // tierRate and footnotes are not represented in the supplied OpenAPI contract.
      updateSectionStatus(
        "eligibility",
        values.tierRate || values.footnotes.trim().length > 0 ? "warning" : "completed",
      );
    } finally {
      setSectionSaving(false);
    }
  }, [
    form,
    isReadOnly,
    programId,
    revisionId,
    setupQuery.data,
    setSectionSaving,
    updateSectionStatus,
    updateSetup,
  ]);

  useEffect(() => {
    registerSaveHandler(isReadOnly ? null : save);
    return () => registerSaveHandler(null);
  }, [isReadOnly, registerSaveHandler, save]);

  return (
    <FormProvider {...form}>
      <Box
        component="form"
        onSubmit={form.handleSubmit(async () => save())}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <ProgramSection title="Financial provider">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2.5,
            }}
          >
            <FormSelect
              control={form.control}
              name="financialProviderCode"
              label="Provider"
              required
              options={FINANCIAL_PROVIDER_OPTIONS}
              disabled={isReadOnly}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                minWidth: 0,
              }}
            >
              <Typography
                variant="overline"
                sx={{ mb: 0.75, color: "text.secondary" }}
              >
                Tier rate
              </Typography>
              <Box
                sx={{
                  minHeight: 40,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FormCheckbox
                  control={form.control}
                  name="tierRate"
                  variant="inline"
                  disabled={isReadOnly}
                  label={
                    <>
                      Apply tier-based rate structure{" "}
                      <Box
                        component="span"
                        sx={{ color: "warning.main", fontWeight: 700 }}
                      >
                        (TBD)
                      </Box>
                    </>
                  }
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
              disabled={isReadOnly}
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
            disabled={isReadOnly}
          />
        </ProgramSection>

        <ProgramSection
          title="Eligibility footnotes"
          description="Legal & conditional text shown with the incentive."
        >
          <FormTextarea
            control={form.control}
            name="footnotes"
            label="Footnotes"
            required
            placeholder="Enter disclaimer or conditions..."
            maxLength={2000}
            showCounter
            disabled={isReadOnly}
          />
        </ProgramSection>
      </Box>
    </FormProvider>
  );
}
