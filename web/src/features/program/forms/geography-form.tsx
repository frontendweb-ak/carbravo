import { useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Stack } from "@mui/material";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import {
  CoverageRules,
  GeographyTargeting,
} from "@/features/program/components/geography";

import {
  useProgramGeography,
  useUpdateProgramGeography,
} from "../hooks/use-geography";

import { useProgramEditor } from "../editor/program-editor-context";
import { geographyDefaultValues } from "../constants";
import {
  geographyFormToRequest,
  geographyResponseToForm,
} from "../model/geography.mapper";
import {
  type GeographyFormValues,
  type GeographyRule,
  geographyFormSchema,
} from "../schema";

function createRuleId() {
  return crypto.randomUUID();
}

export function GeographyForm() {
  const {
    programId,
    revisionId,
    isReadOnly,
    isMinorRevision,
    registerSaveHandler,
    setSectionSaving,
    updateSectionStatus,
  } = useProgramEditor();
  const canEdit = !isReadOnly && !isMinorRevision;
  const isEdit = programId != null && revisionId != null;

  const geographyQuery = useProgramGeography(programId, revisionId);
  const updateGeography = useUpdateProgramGeography();

  const form = useForm<GeographyFormValues>({
    resolver: zodResolver(geographyFormSchema),
    defaultValues: geographyDefaultValues,
    mode: "onBlur",
  });

  const included = useWatch({ control: form.control, name: "included" }) ?? [];
  const excluded = useWatch({ control: form.control, name: "excluded" }) ?? [];

  useEffect(() => {
    if (!isEdit || !geographyQuery.data || form.formState.isDirty) return;
    form.reset(geographyResponseToForm(geographyQuery.data));
  }, [isEdit, geographyQuery.data, form]);

  const addRule = (mode: "include" | "exclude") => {
    if (!canEdit) return;
    const currentRule = form.getValues("currentRule");
    if (!currentRule.code) return;

    const rule: GeographyRule = {
      id: createRuleId(),
      level: currentRule.level,
      code: currentRule.code,
      name: currentRule.name,
    };

    if (mode === "include") {
      form.setValue("included", [...included, rule], {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else {
      form.setValue("excluded", [...excluded, rule], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    form.setValue("currentRule.code", "", {
      shouldDirty: true,
      shouldValidate: false,
    });
    form.setValue("currentRule.name", "", {
      shouldDirty: true,
      shouldValidate: false,
    });
  };

  const removeIncluded = (index: number) => {
    if (!canEdit) return;
    form.setValue(
      "included",
      included.filter((_, itemIndex) => itemIndex !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const removeExcluded = (index: number) => {
    if (!canEdit) return;
    form.setValue(
      "excluded",
      excluded.filter((_, itemIndex) => itemIndex !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const onSubmit = useCallback(async (values: GeographyFormValues) => {
    if (!canEdit || programId == null || revisionId == null) return;

    setSectionSaving(true);
    try {
      await updateGeography.mutateAsync({
        programId,
        revisionId,
        payload: geographyFormToRequest(values),
      });
      updateSectionStatus("geography", "completed");
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
    updateGeography,
    updateSectionStatus,
  ]);

  useEffect(() => {
    registerSaveHandler(async () => {
      await form.handleSubmit(onSubmit)();
    });
    return () => registerSaveHandler(null);
  }, [form, onSubmit, registerSaveHandler]);

  return (
    <FormProvider {...form}>
      <Stack
        component="form"
        onSubmit={form.handleSubmit(onSubmit)}
        spacing={2.5}
      >
        {isMinorRevision && (
          <Alert severity="info">
            Geography is locked for a minor revision. Minor revisions can update marketing text only.
          </Alert>
        )}

        <GeographyTargeting
          control={form.control}
          setValue={form.setValue}
          onAdd={addRule}
          disabled={!canEdit}
        />

        <CoverageRules
          included={included}
          excluded={excluded}
          onRemoveInclude={canEdit ? removeIncluded : undefined}
          onRemoveExclude={canEdit ? removeExcluded : undefined}
        />
      </Stack>
    </FormProvider>
  );
}
