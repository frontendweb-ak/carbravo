import { useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Grid, Stack, Typography } from "@mui/material";
import { FormProvider, useForm, type Path } from "react-hook-form";

import { FormChoiceChipGroup, FormInput } from "@/components/ui/forms";
import { ProgramSection } from "../components";
import { incentiveValuesDefaultValues, STACKABILITY_OPTIONS } from "../constants";
import { useProgramEditor } from "../editor/program-editor-context";
import { useProgramValues, useUpdateProgramValues } from "../hooks";
import {
  mapIncentiveFormToComponents,
  mapProgramValuesToForm,
} from "../model/incentive-values.mapper";
import {
  type IncentiveValuesFormValues,
  incentiveValuesFormSchema,
} from "../schema";

export function IncentiveValuesForm() {
  const {
    programId,
    revisionId,
    isReadOnly,
    isMinorRevision,
    registerSaveHandler,
    setSectionSaving,
    updateSectionStatus,
  } = useProgramEditor();

  const valuesQuery = useProgramValues(programId, revisionId);
  const updateValues = useUpdateProgramValues();
  const canEdit = !isReadOnly && !isMinorRevision;

  const form = useForm<IncentiveValuesFormValues>({
    resolver: zodResolver(incentiveValuesFormSchema),
    defaultValues: incentiveValuesDefaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (!valuesQuery.data || form.formState.isDirty) return;
    form.reset(mapProgramValuesToForm(valuesQuery.data));
  }, [form, valuesQuery.data]);

  const onSubmit = useCallback(async (values: IncentiveValuesFormValues) => {
    if (!canEdit || programId == null || revisionId == null || !valuesQuery.data) {
      return;
    }

    setSectionSaving(true);
    try {
      const components = mapIncentiveFormToComponents(values, valuesQuery.data);
      await updateValues.mutateAsync({
        programId,
        revisionId,
        payload: { components },
      });
      updateSectionStatus(
        "incentive-values",
        components.length > 0 ? "completed" : "warning",
      );
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
    updateSectionStatus,
    updateValues,
    valuesQuery.data,
  ]);

  useEffect(() => {
    registerSaveHandler(async () => {
      await form.handleSubmit(onSubmit)();
    });
    return () => registerSaveHandler(null);
  }, [form, onSubmit, registerSaveHandler]);

  const aprTerms = valuesQuery.data?.financeTerms ?? [];

  return (
    <FormProvider {...form}>
      <Stack
        component="form"
        onSubmit={form.handleSubmit(onSubmit)}
        spacing={2.5}
      >
        {isMinorRevision && (
          <Alert severity="info">
            Incentive values are locked for a minor revision. Only marketing text can be changed.
          </Alert>
        )}

        <ProgramSection
          title="APR by term"
          description="Set Purchase Type to Finance in Setup to author APR by term."
        >
          {aprTerms.length === 0 ? (
            <Box sx={{ borderRadius: 1.5, backgroundColor: "action.hover", px: 1.5, py: 1.25 }}>
              <Typography variant="body2" color="text.secondary">
                Select one or more finance terms in Setup to configure APR values here.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {aprTerms.map((termMonths, index) => (
                <Grid key={termMonths} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <FormInput
                    control={form.control}
                    name={`aprByTerm.${index}.aprRate` as Path<IncentiveValuesFormValues>}
                    label={`${termMonths}-month APR`}
                    type="number"
                    placeholder="0.00"
                    rightElement={
                      <Typography variant="caption" color="text.secondary">%</Typography>
                    }
                    disabled={!canEdit}
                  />
                </Grid>
              ))}
            </Grid>
          )}
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
                disabled={!canEdit}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <FormInput
                control={form.control}
                name="bonusCash"
                label="Bonus Cash"
                type="number"
                placeholder="0"
                disabled={!canEdit}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <FormInput
                control={form.control}
                name="downPaymentAssist"
                label="Down Payment Assist"
                type="number"
                placeholder="0"
                disabled={!canEdit}
              />
            </Grid>
          </Grid>
        </ProgramSection>

        <ProgramSection
          title="Stackability"
          description="How this program combines with others on the same deal."
        >
          <Alert severity="info" sx={{ mb: 2 }}>
            Stackability and belongs-to fields appear in the UI reference but are not represented in the current OpenAPI values schema. They are shown for reference and are not sent to the API.
          </Alert>
          <Stack spacing={3}>
            <FormChoiceChipGroup
              control={form.control}
              name="stackableWith"
              label="Stackable with"
              description="Can combine"
              selectionMode="multiple"
              options={STACKABILITY_OPTIONS}
              borderRadius={5}
              disabled
            />
            <FormChoiceChipGroup
              control={form.control}
              name="notStackableWith"
              label="Not stackable with"
              description="Mutually exclusive"
              selectionMode="multiple"
              options={STACKABILITY_OPTIONS}
              borderRadius={5}
              disabled
            />
            <FormInput
              control={form.control}
              name="belongsTo"
              label="Belongs to"
              placeholder="e.g. GMF National"
              disabled
            />
          </Stack>
        </ProgramSection>
      </Stack>
    </FormProvider>
  );
}
