import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useCallback, useEffect, useRef } from "react";

import { FormChoiceChipGroup, FormInput } from "@/components/ui/forms";

import { ProgramSection } from "../components";
import {
  incentiveValuesDefaultValues,
  STACKABILITY_OPTIONS,
} from "../constants";
import {
  type IncentiveValuesFormValues,
  incentiveValuesFormSchema,
} from "../schema";
import { useProgramEditor } from "../editor/program-editor-context";
import { useProgramValues, useUpdateProgramValues } from "../hooks";
import {
  hasUnsupportedStackabilityValues,
  mapValuesFormToRequest,
  mapValuesResponseToForm,
} from "../model/values.mapper";

export function IncentiveValuesForm() {
  const {
    programId,
    revisionId,
    isReadOnly,
    registerSaveHandler,
    updateSectionStatus,
    setSectionSaving,
  } = useProgramEditor();

  const valuesQuery = useProgramValues(programId, revisionId);
  const updateValues = useUpdateProgramValues();
  const hydratedRevisionRef = useRef<string | null>(null);

  const form = useForm<IncentiveValuesFormValues>({
    resolver: zodResolver(incentiveValuesFormSchema),
    defaultValues: incentiveValuesDefaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (!valuesQuery.data || programId == null || revisionId == null) return;
    const key = `${programId}:${revisionId}`;
    if (hydratedRevisionRef.current === key) return;

    hydratedRevisionRef.current = key;
    form.reset(mapValuesResponseToForm(valuesQuery.data));
    updateSectionStatus("incentive-values", "completed");
  }, [valuesQuery.data, programId, revisionId, form, updateSectionStatus]);

  useEffect(() => {
    if (valuesQuery.isError) {
      updateSectionStatus("incentive-values", "warning");
    }
  }, [valuesQuery.isError, updateSectionStatus]);

  const save = useCallback(async () => {
    if (isReadOnly || programId == null || revisionId == null) return;

    const isValid = await form.trigger();
    if (!isValid) {
      updateSectionStatus("incentive-values", "warning");
      return;
    }

    const values = form.getValues();
    setSectionSaving(true);
    try {
      await updateValues.mutateAsync({
        programId,
        revisionId,
        payload: mapValuesFormToRequest(values),
      });
      form.reset(values);
      updateSectionStatus(
        "incentive-values",
        hasUnsupportedStackabilityValues(values) ? "warning" : "completed",
      );
    } finally {
      setSectionSaving(false);
    }
  }, [
    form,
    isReadOnly,
    programId,
    revisionId,
    setSectionSaving,
    updateSectionStatus,
    updateValues,
  ]);

  useEffect(() => {
    registerSaveHandler(isReadOnly ? null : save);
    return () => registerSaveHandler(null);
  }, [isReadOnly, registerSaveHandler, save]);

  return (
    <FormProvider {...form}>
      <Stack
        component="form"
        onSubmit={form.handleSubmit(async () => save())}
        spacing={2.5}
      >
        <ProgramSection
          title="APR by term"
          description="Set Purchase type to Finance in Setup to author APR by term."
        >
          <Box
            sx={{
              borderRadius: 1.5,
              backgroundColor: "action.hover",
              px: 1.5,
              py: 1.25,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              APR values can be configured when the program's Purchase Type is
              set to Finance.
            </Typography>
          </Box>
        </ProgramSection>

        <ProgramSection title="Cash values">
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <FormInput
                control={form.control}
                name="customerCash"
                label="Customer Cash"
                type="number"
                placeholder="0"
                disabled={isReadOnly}
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <FormInput
                control={form.control}
                name="bonusCash"
                label="Bonus Cash"
                type="number"
                placeholder="0"
                disabled={isReadOnly}
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <FormInput
                control={form.control}
                name="downPaymentAssist"
                label="Down Payment Assist"
                type="number"
                placeholder="0"
                disabled={isReadOnly}
              />
            </Grid>
          </Grid>
        </ProgramSection>

        <ProgramSection
          title="Stackability"
          description="How this program combines with others on the same deal."
        >
          <Stack spacing={3}>
            <FormChoiceChipGroup
              control={form.control}
              name="stackableWith"
              label="Stackable with"
              description="Can combine"
              selectionMode="multiple"
              options={STACKABILITY_OPTIONS}
              borderRadius={5}
              disabled={isReadOnly}
            />

            <FormChoiceChipGroup
              control={form.control}
              name="notStackableWith"
              label="Not stackable with"
              description="Mutually exclusive"
              selectionMode="multiple"
              options={STACKABILITY_OPTIONS}
              borderRadius={5}
              disabled={isReadOnly}
            />

            <FormInput
              control={form.control}
              name="belongsTo"
              label="Belongs to"
              placeholder="e.g. GMF National"
              disabled={isReadOnly}
            />
          </Stack>
        </ProgramSection>
      </Stack>
    </FormProvider>
  );
}
