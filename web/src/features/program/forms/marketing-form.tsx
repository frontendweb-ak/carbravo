import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { FormInput, FormTextarea } from "@/components/ui/forms";

import { ProgramSection } from "../components";
import { marketingDefaultValues } from "../constants";
import { useProgramEditor } from "../editor/program-editor-context";
import {
  useProgramSetup,
  useUpdateProgramSetup,
} from "../hooks";
import {
  mergeSetupResponseToDto,
} from "../model/setup.mapper";
import { type MarketingFormValues, marketingFormSchema } from "../schema";

export function MarketingForm() {
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

  const form = useForm<MarketingFormValues>({
    resolver: zodResolver(marketingFormSchema),
    defaultValues: marketingDefaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (!setupQuery.data || programId == null || revisionId == null) return;
    const key = `${programId}:${revisionId}`;
    if (hydratedRevisionRef.current === key) return;

    hydratedRevisionRef.current = key;
    form.reset({
      mfpnText: setupQuery.data.mfpnText ?? "",
      disclosureText: setupQuery.data.disclosureText ?? "",
    });
    updateSectionStatus("marketing", "completed");
  }, [setupQuery.data, programId, revisionId, form, updateSectionStatus]);

  useEffect(() => {
    if (setupQuery.isError) updateSectionStatus("marketing", "warning");
  }, [setupQuery.isError, updateSectionStatus]);

  const save = useCallback(async () => {
    if (isReadOnly || programId == null || revisionId == null || !setupQuery.data) return;

    const isValid = await form.trigger();
    if (!isValid) {
      updateSectionStatus("marketing", "warning");
      return;
    }

    const values = form.getValues();
    setSectionSaving(true);
    try {
      const payload = mergeSetupResponseToDto(setupQuery.data, {
        mfpnText: values.mfpnText,
        disclosureText: values.disclosureText,
      });
      await updateSetup.mutateAsync({ programId, revisionId, payload });
      form.reset(values);
      updateSectionStatus("marketing", "completed");
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
