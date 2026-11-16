import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
	it("renders its title, description, and action", () => {
		render(
			<EmptyState
				title="No programs yet"
				description="Create a program to get started."
				action={<button type="button">Create program</button>}
			/>,
		);

		expect(screen.getByText("No programs yet")).toBeInTheDocument();
		expect(screen.getByText("Create a program to get started.")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Create program" })).toBeInTheDocument();
	});

	it("does not render optional content when it is not provided", () => {
		render(<EmptyState title="Nothing here yet" />);

		expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});
});
