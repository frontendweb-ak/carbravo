import { useCallback, useEffect, useRef, type FormEvent } from "react";
import {
	useFormState,
	type FieldValues,
	type SubmitHandler,
	type UseFormReturn,
} from "react-hook-form";

import { useProgramEditor } from "../editor/program-editor-context";

interface UseProgramSectionSaveOptions<
	TFieldValues extends FieldValues,
	TContext = unknown,
	TTransformedValues = TFieldValues,
> {
	form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
	onSave: SubmitHandler<TTransformedValues>;
	enabled?: boolean;
}

function getSaveErrorMessage(error: unknown): string {
	return error instanceof Error
		? error.message
		: "We couldn't save this section. Please try again.";
}

export function useProgramSectionSave<
	TFieldValues extends FieldValues,
	TContext = unknown,
	TTransformedValues = TFieldValues,
>({
	form,
	onSave,
	enabled = true,
}: UseProgramSectionSaveOptions<
	TFieldValues,
	TContext,
	TTransformedValues
>) {
	const { registerSaveHandler, setSaveStatus } = useProgramEditor();
	const { isDirty } = useFormState({ control: form.control });
	const onSaveRef = useRef(onSave);
	onSaveRef.current = onSave;

	const submit = useCallback(async () => {
		if (!enabled) return;

		setSaveStatus("saving");

		try {
			await form.handleSubmit(
				async (values) => {
					await onSaveRef.current(values);
					setSaveStatus("saved");
				},
				() => {
					setSaveStatus("invalid");
				},
			)();
		} catch (error) {
			setSaveStatus("error", getSaveErrorMessage(error));
		}
	}, [enabled, form, setSaveStatus]);

	useEffect(() => {
		if (!enabled) {
			registerSaveHandler(null);
			return;
		}

		registerSaveHandler(submit);
		return () => registerSaveHandler(null);
	}, [enabled, registerSaveHandler, submit]);

	useEffect(() => {
		if (enabled && isDirty) {
			setSaveStatus("unsaved");
		}
	}, [enabled, isDirty, setSaveStatus]);

	return {
		submit,
		handleSubmit: (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			void submit();
		},
	};
}
