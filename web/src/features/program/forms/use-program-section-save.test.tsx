import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { ProgramEditorProvider, useProgramEditor } from "../editor/program-editor-context";
import { useProgramSectionSave } from "./use-program-section-save";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
});

type FormValues = z.infer<typeof formSchema>;

function createWrapper() {
	return function Wrapper({ children }: { children: React.ReactNode }) {
		return (
			<ProgramEditorProvider mode="new">
				{children}
			</ProgramEditorProvider>
		);
	};
}

function useTestSave(onSave: (values: FormValues) => Promise<void>) {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { name: "" },
		mode: "onBlur",
	});
	const save = useProgramSectionSave({ form, onSave });
	const editor = useProgramEditor();

	return { form, ...save, saveStatus: editor.saveStatus, saveError: editor.saveError };
}

describe("useProgramSectionSave", () => {
	it("marks the section unsaved when a form field changes", async () => {
		const onSave = vi.fn().mockResolvedValue(undefined);
		const { result } = renderHook(() => useTestSave(onSave), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			result.current.form.setValue("name", "Spring Event", { shouldDirty: true });
		});

		await waitFor(() => expect(result.current.saveStatus).toBe("unsaved"));
	});

	it("runs validation before persistence and reports invalid forms", async () => {
		const onSave = vi.fn().mockResolvedValue(undefined);
		const { result } = renderHook(() => useTestSave(onSave), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			await result.current.submit();
		});

		expect(onSave).not.toHaveBeenCalled();
		expect(result.current.saveStatus).toBe("invalid");
		expect(result.current.form.getFieldState("name").error?.message).toBe(
			"Name is required",
		);
	});

	it("marks the section saved only after persistence succeeds", async () => {
		const onSave = vi.fn().mockResolvedValue(undefined);
		const { result } = renderHook(() => useTestSave(onSave), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			result.current.form.setValue("name", "Spring Event", { shouldDirty: true });
		});
		await act(async () => {
			await result.current.submit();
		});

		expect(onSave).toHaveBeenCalledWith({ name: "Spring Event" });
		expect(result.current.saveStatus).toBe("saved");
	});

	it("retains an error state when the persistence request rejects", async () => {
		const onSave = vi.fn().mockRejectedValue(new Error("Network unavailable"));
		const { result } = renderHook(() => useTestSave(onSave), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			result.current.form.setValue("name", "Spring Event", { shouldDirty: true });
		});
		await act(async () => {
			await result.current.submit();
		});

		expect(result.current.saveStatus).toBe("error");
		expect(result.current.saveError).toBe("Network unavailable");
	});
});
