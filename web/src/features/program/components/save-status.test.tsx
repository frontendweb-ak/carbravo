import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SaveStatus } from "./save-status";

describe("SaveStatus", () => {
	it.each([
		["idle", "Not saved yet"],
		["unsaved", "Unsaved changes"],
		["saving", "Saving..."],
		["saved", "All changes saved"],
		["invalid", "Fix validation errors"],
		["error", "Save failed: Network unavailable"],
	] as const)("communicates the %s state", (status, message) => {
		render(
			<SaveStatus
				status={status}
				error={status === "error" ? "Network unavailable" : undefined}
				onSave={vi.fn()}
			/>,
		);

		expect(screen.getByRole("status")).toHaveTextContent(message);
	});

	it("does not claim that changes are saved while idle", () => {
		render(<SaveStatus status="idle" />);

		expect(screen.getByRole("status")).toHaveTextContent("Not saved yet");
		expect(screen.queryByText("All changes saved")).not.toBeInTheDocument();
	});

	it("does not show the save action when save is intentionally hidden", () => {
		render(<SaveStatus status="unsaved" hideSave />);

		expect(screen.queryByRole("button", { name: "Save draft" })).not.toBeInTheDocument();
	});
});
