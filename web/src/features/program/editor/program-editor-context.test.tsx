import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it, vi } from "vitest";

import {
	ProgramEditorProvider,
	useProgramEditor,
} from "./program-editor-context";

function EditorConsumer({
	onSave,
}: {
	onSave?: () => Promise<void>;
}) {
	const {
		mode,
		programId,
		revisionId,
		programIdentifier,
		programName,
		revisionLabel,
		programStatus,
		isSubmitted,
		approved,
		sections,
		completion,
		activeSection,
		isSaving,
		isReadOnly,
		isMinorRevision,
		setProgramIdentity,
		setActiveSection,
		updateSectionStatus,
		setSummaryDraft,
		summaryDraft,
		setEligibilityFootnotesDraft,
		eligibilityFootnotesDraft,
		registerSaveHandler,
		saveCurrentSection,
	} = useProgramEditor();

	useEffect(() => {
		if (!onSave) return;
		registerSaveHandler(onSave);
		return () => registerSaveHandler(null);
	}, [onSave, registerSaveHandler]);

	return (
		<div>
			<output data-testid="editor-state">
				{JSON.stringify({
					mode,
					programId,
					revisionId,
					programIdentifier,
					programName,
					revisionLabel,
					programStatus,
					isSubmitted,
					approved,
					completion,
					activeSection,
					isSaving,
					isReadOnly,
					isMinorRevision,
					summaryDraft,
					eligibilityFootnotesDraft,
					sectionStatuses: sections.map(({ id, status }) => ({ id, status })),
				})}
			</output>
			<button
				type="button"
				onClick={() => setProgramIdentity({
					programId: 101,
					revisionId: 202,
					programIdentifier: "CB-101",
					programName: "Spring Event",
					revisionLabel: "2.1",
				})}
			>
				Set identity
			</button>
			<button
				type="button"
				onClick={() => {
					updateSectionStatus("setup", "completed");
					updateSectionStatus("vehicles", "completed");
					updateSectionStatus("geography", "completed");
					updateSectionStatus("eligibility", "completed");
					updateSectionStatus("incentive-values", "completed");
					updateSectionStatus("summary", "completed");
				}}
			>
				Complete required sections
			</button>
			<button
				type="button"
				onClick={() => updateSectionStatus("marketing", "completed")}
			>
				Complete optional section
			</button>
			<button
				type="button"
				onClick={() => updateSectionStatus("unknown", "completed")}
			>
				Complete unknown section
			</button>
			<button type="button" onClick={() => setActiveSection("vehicles")}>
				Go to vehicles section
			</button>
			<button type="button" onClick={() => setActiveSection("unknown")}>
				Go to unknown section
			</button>
			<button type="button" onClick={() => setSummaryDraft("Local summary")}>
				Set summary draft
			</button>
			<button
				type="button"
				onClick={() => setEligibilityFootnotesDraft("Local eligibility footnotes")}
			>
				Set eligibility draft
			</button>
			<button type="button" onClick={() => void saveCurrentSection()}>
				Save current section
			</button>
		</div>
	);
}

function renderEditor({
	mode = "edit",
	programId = 10,
	revisionId = 20,
	programStatus = "DRAFT",
	isMinorRevision = false,
	onSave,
}: {
	mode?: "new" | "edit";
	programId?: number;
	revisionId?: number;
	programStatus?: "DRAFT" | "REVIEW" | "APPROVED" | "ACTIVE" | "EXPIRED";
	isMinorRevision?: boolean;
	onSave?: () => Promise<void>;
} = {}) {
	return render(
		<ProgramEditorProvider
			mode={mode}
			programId={mode === "edit" ? programId : undefined}
			revisionId={mode === "edit" ? revisionId : undefined}
			programIdentifier={mode === "edit" ? "CB-10" : undefined}
			programName={mode === "edit" ? "Initial program" : undefined}
			revisionLabel={mode === "edit" ? "1.0" : undefined}
			programStatus={mode === "edit" ? programStatus : undefined}
			isMinorRevision={isMinorRevision}
		>
			<EditorConsumer onSave={onSave} />
		</ProgramEditorProvider>,
	);
}

function getState() {
	return JSON.parse(screen.getByTestId("editor-state").textContent ?? "{}") as {
		mode: string;
		programId?: number;
		revisionId?: number;
		programIdentifier?: string;
		programName?: string;
		revisionLabel?: string;
		programStatus?: string;
		isSubmitted: boolean;
		approved: boolean;
		completion: number;
		activeSection: string;
		isSaving: boolean;
		isReadOnly: boolean;
		isMinorRevision: boolean;
		summaryDraft: string;
		eligibilityFootnotesDraft: string;
		sectionStatuses: { id: string; status: string }[];
	};
}

describe("ProgramEditorProvider", () => {
	it("initializes editor identity and pending section state", () => {
		renderEditor();

		expect(getState()).toMatchObject({
			mode: "edit",
			programId: 10,
			revisionId: 20,
			programIdentifier: "CB-10",
			programName: "Initial program",
			revisionLabel: "1.0",
			programStatus: "DRAFT",
			completion: 0,
			activeSection: "setup",
			isSubmitted: false,
			approved: false,
			isReadOnly: false,
		});
		expect(getState().sectionStatuses).toHaveLength(8);
		expect(getState().sectionStatuses.every((section) => section.status === "pending")).toBe(true);
	});

	it("updates identity fields after a new program and revision are created", () => {
		renderEditor();

		fireEvent.click(screen.getByRole("button", { name: "Set identity" }));

		expect(getState()).toMatchObject({
			programId: 101,
			revisionId: 202,
			programIdentifier: "CB-101",
			programName: "Spring Event",
			revisionLabel: "2.1",
		});
	});

	it("calculates completion from required sections only", () => {
		renderEditor();

		fireEvent.click(screen.getByRole("button", { name: "Complete optional section" }));
		expect(getState().completion).toBe(0);

		fireEvent.click(screen.getByRole("button", { name: "Complete required sections" }));
		expect(getState().completion).toBe(100);
	});

	it("ignores unknown section IDs for status and navigation updates", () => {
		renderEditor();

		fireEvent.click(screen.getByRole("button", { name: "Complete unknown section" }));
		fireEvent.click(screen.getByRole("button", { name: "Go to unknown section" }));

		expect(getState().completion).toBe(0);
		expect(getState().activeSection).toBe("setup");

		fireEvent.click(screen.getByRole("button", { name: "Go to vehicles section" }));
		expect(getState().activeSection).toBe("vehicles");
	});

	it.each([
		["DRAFT", false, false, false],
		["REVIEW", true, false, true],
		["APPROVED", true, true, true],
		["ACTIVE", true, true, true],
		["EXPIRED", true, true, true],
	] as const)(
		"derives workflow permissions for %s status",
		(programStatus, isSubmitted, approved, isReadOnly) => {
			renderEditor({ programStatus });

			expect(getState()).toMatchObject({
				programStatus,
				isSubmitted,
				approved,
				isReadOnly,
			});
		},
	);

	it("keeps a new program editable before it has a workflow status", () => {
		renderEditor({ mode: "new" });

		expect(getState()).toMatchObject({
			mode: "new",
			programId: undefined,
			revisionId: undefined,
			isReadOnly: false,
		});
	});

	it("retains local drafts while the editor remains on the same revision", () => {
		renderEditor();

		fireEvent.click(screen.getByRole("button", { name: "Set summary draft" }));
		fireEvent.click(screen.getByRole("button", { name: "Set eligibility draft" }));

		expect(getState()).toMatchObject({
			summaryDraft: "Local summary",
			eligibilityFootnotesDraft: "Local eligibility footnotes",
		});
	});

	it("resets section and local draft state when the edited revision changes", async () => {
		const view = renderEditor();

		fireEvent.click(screen.getByRole("button", { name: "Complete required sections" }));
		fireEvent.click(screen.getByRole("button", { name: "Set summary draft" }));
		fireEvent.click(screen.getByRole("button", { name: "Set eligibility draft" }));
		expect(getState().completion).toBe(100);

		view.rerender(
			<ProgramEditorProvider
				mode="edit"
				programId={11}
				revisionId={21}
				programStatus="DRAFT"
			>
				<EditorConsumer />
			</ProgramEditorProvider>,
		);

		await waitFor(() => {
			expect(getState()).toMatchObject({
				programId: 11,
				revisionId: 21,
				completion: 0,
				summaryDraft: "",
				eligibilityFootnotesDraft: "",
			});
		});
	});

	it("registers and runs the active section save handler", async () => {
		const onSave = vi.fn().mockResolvedValue(undefined);
		renderEditor({ onSave });

		fireEvent.click(screen.getByRole("button", { name: "Save current section" }));

		await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
		expect(getState().isSaving).toBe(false);
	});

	it("keeps the shared saving state true until the active save completes", async () => {
		let resolveSave: (() => void) | undefined;
		const onSave = vi.fn(
			() =>
				new Promise<void>((resolve) => {
					resolveSave = resolve;
				}),
		);
		renderEditor({ onSave });

		fireEvent.click(screen.getByRole("button", { name: "Save current section" }));
		await waitFor(() => expect(getState().isSaving).toBe(true));

		await act(async () => {
			resolveSave?.();
		});
		await waitFor(() => expect(getState().isSaving).toBe(false));
	});

	it("clears saving state when a registered save handler rejects", async () => {
		const onSave = vi.fn().mockRejectedValue(new Error("Save failed"));
		renderEditor({ onSave });

		fireEvent.click(screen.getByRole("button", { name: "Save current section" }));

		await waitFor(() => expect(getState().isSaving).toBe(false));
	});
});

describe("useProgramEditor", () => {
	it("throws when used outside ProgramEditorProvider", () => {
		function ConsumerOutsideProvider() {
			useProgramEditor();
			return null;
		}

		expect(() => render(<ConsumerOutsideProvider />)).toThrow(
			"useProgramEditor must be used inside ProgramEditorProvider",
		);
	});
});
