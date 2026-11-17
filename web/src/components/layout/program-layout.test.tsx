import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProgramLayout from "./program-layout";

const mocks = vi.hoisted(() => ({
	useProgram: vi.fn(),
	useProgramRevisionHistory: vi.fn(),
	layoutProps: vi.fn(),
	providerProps: vi.fn(),
}));

vi.mock("@/features/program", () => ({
	useProgram: mocks.useProgram,
	useProgramRevisionHistory: mocks.useProgramRevisionHistory,
}));

vi.mock("@/features/program/editor/program-editor-context", () => ({
	ProgramEditorProvider: ({
		children,
		...props
	}: {
		children: ReactNode;
		[key: string]: unknown;
	}) => {
		mocks.providerProps(props);
		return <div data-testid="editor-provider">{children}</div>;
	},
}));

vi.mock("@/features/program/components", () => ({
	ProgramLayoutContent: (props: Record<string, unknown>) => {
		mocks.layoutProps(props);
		return <div data-testid="program-layout-content" />;
	},
}));

const activeRevision = {
	id: 100,
	label: "1.0",
	major: 1,
	minor: 0,
	status: "ACTIVE" as const,
	isMinorRevision: false,
	isSubmitted: true,
	approved: true,
};

const draftRevision = {
	id: 101,
	label: "1.1",
	major: 1,
	minor: 1,
	status: "DRAFT" as const,
	isMinorRevision: false,
	isSubmitted: false,
	approved: false,
};

const program = {
	id: 42,
	identifier: "CB-2026-0042",
	name: "Spring Finance Event",
	status: "DRAFT" as const,
	type: null,
	revision: activeRevision,
	hasDraft: true,
	vehicles: [],
	geography: [],
	deliveryStartDate: null,
	deliveryEndDate: null,
	updatedAt: null,
	activeRevision,
	draftRevision,
};

const history = {
	revisions: [
		{
			id: 101,
			label: "1.1",
			major: 1,
			minor: 1,
			status: "DRAFT" as const,
			isMinorRevision: false,
			createdAt: "2026-03-01T10:00:00Z",
			createdBy: "Author",
			postedAt: null,
			postedBy: null,
			isSubmitted: false,
			approved: false,
		},
		{
			id: 100,
			label: "1.0",
			major: 1,
			minor: 0,
			status: "ACTIVE" as const,
			isMinorRevision: false,
			createdAt: "2026-02-01T10:00:00Z",
			createdBy: "Author",
			postedAt: "2026-02-02T10:00:00Z",
			postedBy: "Admin",
			isSubmitted: true,
			approved: true,
		},
		{
			id: 99,
			label: "0.9",
			major: 0,
			minor: 9,
			status: "EXPIRED" as const,
			isMinorRevision: false,
			createdAt: "2026-01-01T10:00:00Z",
			createdBy: "Author",
			postedAt: "2026-01-02T10:00:00Z",
			postedBy: "Admin",
			isSubmitted: true,
			approved: true,
		},
	],
	pagination: {
		page: 0,
		size: 25,
		totalElements: 3,
		totalPages: 1,
	},
};

function renderAt(path: string) {
	return render(
		<MemoryRouter initialEntries={[path]}>
			<Routes>
				<Route path="/programs/:programId/*" element={<ProgramLayout />} />
			</Routes>
		</MemoryRouter>,
	);
}

describe("ProgramLayout", () => {
	beforeEach(() => {
		mocks.layoutProps.mockReset();
		mocks.providerProps.mockReset();
		mocks.useProgram.mockReset();
		mocks.useProgramRevisionHistory.mockReset();

		mocks.useProgram.mockReturnValue({
			data: program,
			isLoading: false,
			isError: false,
			refetch: vi.fn(),
		});
		mocks.useProgramRevisionHistory.mockReturnValue({
			data: history,
			isLoading: false,
			isError: false,
			refetch: vi.fn(),
		});
	});

	it("does not enable program queries for an invalid route ID", () => {
		renderAt("/programs/abc/setup");

		expect(mocks.useProgram).toHaveBeenCalledWith(undefined);
		expect(mocks.useProgramRevisionHistory).toHaveBeenCalledWith(undefined);
		expect(screen.getByText("Invalid program link")).toBeInTheDocument();
		expect(screen.queryByTestId("editor-provider")).not.toBeInTheDocument();
	});

	it("keeps the Current editor available while revision history is loading", () => {
		mocks.useProgramRevisionHistory.mockReturnValue({
			data: undefined,
			isLoading: true,
			isError: false,
			refetch: vi.fn(),
		});

		renderAt("/programs/42/setup");

		expect(screen.getByTestId("program-layout-content")).toBeInTheDocument();
		expect(mocks.providerProps).toHaveBeenCalledWith(
			expect.objectContaining({
				programId: 42,
				revisionId: 101,
				revisionLabel: "1.1",
			}),
		);
	});

	it("keeps the Active editor available without revision history", () => {
		mocks.useProgramRevisionHistory.mockReturnValue({
			data: undefined,
			isLoading: true,
			isError: false,
			refetch: vi.fn(),
		});

		renderAt("/programs/42/setup?view=active");

		expect(screen.getByTestId("program-layout-content")).toBeInTheDocument();
		expect(mocks.providerProps).toHaveBeenCalledWith(
			expect.objectContaining({
				programId: 42,
				revisionId: 100,
				revisionLabel: "1.0",
			}),
		);
	});

	it("shows a non-blocking retry warning when history fails for Current", () => {
		const refetch = vi.fn();
		mocks.useProgramRevisionHistory.mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: true,
			refetch,
		});

		renderAt("/programs/42/setup");

		expect(screen.getByTestId("program-layout-content")).toBeInTheDocument();
		expect(mocks.layoutProps).toHaveBeenCalledWith(
			expect.objectContaining({
				revisionHistoryError: true,
				onRetryRevisionHistory: refetch,
			}),
		);
	});

	it("shows a loading state before rendering the revision history list", () => {
		mocks.useProgramRevisionHistory.mockReturnValue({
			data: undefined,
			isLoading: true,
			isError: false,
			refetch: vi.fn(),
		});

		renderAt("/programs/42/setup?view=history");

		expect(screen.getByText("Loading revision history...")).toBeInTheDocument();
		expect(screen.queryByTestId("editor-provider")).not.toBeInTheDocument();
	});

	it("allows retrying a failed revision history request", () => {
		const refetch = vi.fn();
		mocks.useProgramRevisionHistory.mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: true,
			refetch,
		});

		renderAt("/programs/42/setup?view=history");

		fireEvent.click(screen.getByRole("button", { name: "Try again" }));
		expect(refetch).toHaveBeenCalledTimes(1);
	});

	it("rejects a malformed explicit revision ID and offers a recovery route", () => {
		renderAt("/programs/42/setup?view=history&revision=abc");

		expect(screen.getByText("Invalid revision link")).toBeInTheDocument();
		fireEvent.click(
			screen.getByRole("button", { name: "Return to current revision" }),
		);
		expect(screen.getByTestId("program-layout-content")).toBeInTheDocument();
	});

	it("shows an empty state when a valid revision ID is not in program history", () => {
		renderAt("/programs/42/setup?view=history&revision=1234");

		expect(screen.getByText("Revision not found")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Return to current revision" }),
		).toBeInTheDocument();
	});

	it("shows a clear state when the program has no current or active revision", () => {
		mocks.useProgram.mockReturnValue({
			data: {
				...program,
				activeRevision: null,
				draftRevision: null,
			},
			isLoading: false,
			isError: false,
			refetch: vi.fn(),
		});

		renderAt("/programs/42/setup");

		expect(screen.getByText("No revision available")).toBeInTheDocument();
		expect(screen.queryByTestId("editor-provider")).not.toBeInTheDocument();
	});
});
