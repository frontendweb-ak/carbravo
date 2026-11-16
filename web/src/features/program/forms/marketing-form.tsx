import { useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { FormInput, FormTextarea } from "@/components/ui/forms";
import { ProgramSection } from "../components";
import { marketingDefaultValues } from "../constants";
import { useProgramEditor } from "../editor/program-editor-context";
import {
  useProgramSetup,
  useUpdateProgramSetup,
  useUpdateProgramSummaryText,
} from "../hooks";
import { mapSetupResponseToDto } from "../model/setup.mapper";
import { type MarketingFormValues, marketingFormSchema } from "../schema";

export function MarketingForm() {
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
  const updateMinorText = useUpdateProgramSummaryText();
  const form = useForm<MarketingFormValues>({
    resolver: zodResolver(marketingFormSchema),
    defaultValues: marketingDefaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (!setupQuery.data || form.formState.isDirty) return;
    form.reset({
      mfpnText: setupQuery.data.mfpnText ?? "",
      disclosureText: setupQuery.data.disclosureText ?? "",
    });
  }, [setupQuery.data, form]);

  const onSubmit = useCallback(async (values: MarketingFormValues) => {
    if (isReadOnly || programId == null || revisionId == null || !setupQuery.data) {
      return;
    }

    setSectionSaving(true);
    try {
      if (isMinorRevision) {
        await updateMinorText.mutateAsync({
          programId,
          revisionId,
          payload: {
            mfpnText: values.mfpnText.trim(),
            disclosureText: values.disclosureText.trim(),
          },
        });
      } else {
        await updateSetup.mutateAsync({
          programId,
          revisionId,
          payload: {
            ...mapSetupResponseToDto(setupQuery.data),
            mfpnText: values.mfpnText.trim(),
            disclosureText: values.disclosureText.trim(),
          },
        });
      }
      updateSectionStatus("marketing", "completed");
      form.reset(values);
    } finally {
      setSectionSaving(false);
    }
  }, [
    form,
    isMinorRevision,
    isReadOnly,
    programId,
    revisionId,
    setSectionSaving,
    setupQuery.data,
    updateMinorText,
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
            This is a text-only minor revision. Marketing text is saved through the dedicated minor-revision API.
          </Alert>
        )}

        <ProgramSection
          title="Marketing Friendly Program Name (MFPN)"
          description="Consumer-facing program name shown in marketing. Editable in minor revisions."
        >
          <FormInput
            control={form.control}
            name="mfpnText"
            label="MFPN"
            required
            placeholder="e.g. Summer Finance Event"
            disabled={isReadOnly}
          />
        </ProgramSection>

        <ProgramSection
          title="Disclosure"
          description="Consumer-facing legal disclosure shown with the incentive. Editable in minor revisions."
        >
          <FormTextarea
            control={form.control}
            name="disclosureText"
            label=""
            required
            placeholder="Enter consumer disclosure text..."
            disabled={isReadOnly}
          />
        </ProgramSection>
      </Box>
    </FormProvider>
  );
}
