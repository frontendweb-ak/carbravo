import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ErrorState } from "./error-state";

describe("ErrorState", () => {
	it("renders an accessible error message", () => {
		render(
			<ErrorState
				title="Programs could not be loaded"
				description="Check your connection and try again."
			/>,
		);

		expect(screen.getByRole("alert")).toBeInTheDocument();
		expect(screen.getByText("Programs could not be loaded")).toBeInTheDocument();
		expect(screen.getByText("Check your connection and try again.")).toBeInTheDocument();
	});

	it("calls the retry handler when the retry button is selected", () => {
		const onRetry = vi.fn();

		render(<ErrorState onRetry={onRetry} />);

		fireEvent.click(screen.getByRole("button", { name: "Try again" }));

		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it("does not render a retry button without a retry handler", () => {
		render(<ErrorState />);

		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});
});
