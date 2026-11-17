import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProgramEditorProvider } from "../editor/program-editor-context";
import type { ProgramSetupResponseDto } from "../api/setup.api";
import { SetupForm } from "./setup-form";

const mocks = vi.hoisted(() => ({
	createProgram: vi.fn(),
	updateSetup: vi.fn(),
	useProgramSetup: vi.fn(),
}));

vi.mock("@/components/ui", () => import("./setup-form-test-controls"));
vi.mock("../components", () => import("./setup-form-test-controls"));
vi.mock("../hooks", () => ({
	useCreateProgram: () => ({ mutateAsync: mocks.createProgram }),
	useProgramSetup: mocks.useProgramSetup,
	useUpdateProgramSetup: () => ({ mutateAsync: mocks.updateSetup }),
}));

const setupResponse: ProgramSetupResponseDto = {
	programId: 42,
	programIdentifier: "CB-2026-0042",
	revisionId: 420,
	majorRevision: 1,
	minorRevision: 0,
	revisionLabel: "1.0",
	revisionStatus: "DRAFT",
	programName: "Existing Spring Program",
	programTypeCode: "APR",
	customerTypeCodes: ["GENERAL_CONSUMER"],
	contactName: "Alex Morgan",
	contactEmail: "alex@example.com",
	contactPhone: "555-0100",
	financialProviderCode: "GM_FINANCIAL",
	conditionCode: "CARBRAVO",
	conditionTier: "CARBRAVO",
	mileageCeiling: 60000,
	topOfDeal: true,
	vinException: false,
	mfpnText: "Offer subject to approval.",
	disclosureText: "See dealer for details.",
	localeCode: "en-US",
	deliveryStartDate: "2026-03-01",
	deliveryEndDate: "2026-03-31",
	effectiveStartDate: "2026-03-01",
	effectiveEndDate: "2026-03-31",
	financeTerms: [36, 48],
	creditTiers: ["A1", "A2"],
};

function renderSetupForm({
	mode = "new",
	readOnly = false,
	isMinorRevision = false,
	onCreated = vi.fn(),
}: {
	mode?: "new" | "edit";
	readOnly?: boolean;
	isMinorRevision?: boolean;
	onCreated?: (result: { programId: number; revisionId: number }) => void;
} = {}) {
	return render(
		<ProgramEditorProvider
			mode={mode}
			programId={mode === "edit" ? 42 : undefined}
			revisionId={mode === "edit" ? 420 : undefined}
			programStatus={mode === "edit" ? "DRAFT" : undefined}
			isMinorRevision={isMinorRevision}
		>
			<SetupForm
				mode={mode}
				programId={mode === "edit" ? 42 : undefined}
				revisionId={mode === "edit" ? 420 : undefined}
				readOnly={readOnly}
				onCreated={onCreated}
			/>
		</ProgramEditorProvider>,
	);
}

async function flushAutosave() {
	await act(async () => {
		await vi.advanceTimersByTimeAsync(1_000);
	});
}

describe("SetupForm", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		mocks.createProgram.mockReset();
		mocks.updateSetup.mockReset();
		mocks.useProgramSetup.mockReset();

		mocks.createProgram.mockResolvedValue({ programId: 101, revisionId: 1010 });
		mocks.updateSetup.mockResolvedValue({});
		mocks.useProgramSetup.mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: false,
			refetch: vi.fn(),
		});
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("creates a new program and saves its setup after the debounce", async () => {
		const onCreated = vi.fn();
		renderSetupForm({ onCreated });

		fireEvent.change(screen.getByLabelText("Program Name"), {
			target: { value: "Summer Finance Event" },
		});

		await flushAutosave();

		expect(mocks.createProgram).toHaveBeenCalledWith({
			programName: "Summer Finance Event",
		});
		expect(mocks.updateSetup).toHaveBeenCalledWith(
			expect.objectContaining({
				programId: 101,
				revisionId: 1010,
				payload: expect.objectContaining({
					programName: "Summer Finance Event",
				}),
			}),
		);
		expect(onCreated).toHaveBeenCalledWith({
			programId: 101,
			revisionId: 1010,
		});
	});

	it("debounces successive changes and persists the latest program name", async () => {
		renderSetupForm();

		const programName = screen.getByLabelText("Program Name");
		fireEvent.change(programName, { target: { value: "Summer" } });

		await act(async () => {
			await vi.advanceTimersByTimeAsync(600);
		});

		fireEvent.change(programName, { target: { value: "Summer Finance Event" } });

		await act(async () => {
			await vi.advanceTimersByTimeAsync(999);
		});

		expect(mocks.createProgram).not.toHaveBeenCalled();

		await act(async () => {
			await vi.advanceTimersByTimeAsync(1);
		});

		expect(mocks.createProgram).toHaveBeenCalledTimes(1);
		expect(mocks.createProgram).toHaveBeenCalledWith({
			programName: "Summer Finance Event",
		});
	});

	it("hydrates an existing revision and updates it without creating a new program", async () => {
		mocks.useProgramSetup.mockReturnValue({
			data: setupResponse,
			isLoading: false,
			isError: false,
			refetch: vi.fn(),
		});

		renderSetupForm({ mode: "edit" });

		expect(screen.getByLabelText("Program Name")).toHaveValue(
			"Existing Spring Program",
		);

		fireEvent.change(screen.getByLabelText("Program Name"), {
			target: { value: "Updated Spring Program" },
		});

		await flushAutosave();

		expect(mocks.createProgram).not.toHaveBeenCalled();
		expect(mocks.updateSetup).toHaveBeenCalledWith(
			expect.objectContaining({
				programId: 42,
				revisionId: 420,
				payload: expect.objectContaining({
					programName: "Updated Spring Program",
				}),
			}),
		);
	});

	it("disables editable fields in read-only mode and does not autosave", async () => {
		mocks.useProgramSetup.mockReturnValue({
			data: setupResponse,
			isLoading: false,
			isError: false,
			refetch: vi.fn(),
		});

		renderSetupForm({ mode: "edit", readOnly: true });

		expect(screen.getByLabelText("Program Name")).toBeDisabled();

		await flushAutosave();

		expect(mocks.createProgram).not.toHaveBeenCalled();
		expect(mocks.updateSetup).not.toHaveBeenCalled();
	});

	it("disables editable fields for a minor revision", () => {
		mocks.useProgramSetup.mockReturnValue({
			data: setupResponse,
			isLoading: false,
			isError: false,
			refetch: vi.fn(),
		});

		renderSetupForm({ mode: "edit", isMinorRevision: true });

		expect(screen.getByLabelText("Program Name")).toBeDisabled();
	});
});
