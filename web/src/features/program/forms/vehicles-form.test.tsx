import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { VehicleFilterRow } from "../schema";
import { ProgramEditorProvider } from "../editor/program-editor-context";
import { VehiclesForm } from "./vehicles-form";

const mocks = vi.hoisted(() => ({
	resolveVehicleFilters: vi.fn(),
	updateVehicles: vi.fn(),
	programVehicles: vi.fn(),
	vehicleYears: vi.fn(),
	vehicleMakes: vi.fn(),
	vehicleCatalog: vi.fn(),
}));

vi.mock("../hooks/use-program-vehicles", () => ({
	useProgramVehicles: mocks.programVehicles,
	useResolveVehicleFilters: () => mocks.resolveVehicleFilters,
	useUpdateProgramVehicles: () => ({
		mutateAsync: mocks.updateVehicles,
		isPending: false,
	}),
	useVehicleYears: mocks.vehicleYears,
	useVehicleMakesForYears: mocks.vehicleMakes,
	useVehicleCatalog: mocks.vehicleCatalog,
}));

vi.mock("@/features/program/components/vehicle", async () => {
	const actual = await vi.importActual<
		type typeof import("@/features/program/components/vehicle")
	>("@/features/program/components/vehicle");
	const { VehicleFilterBuilderTestDouble } = await import(
		"./vehicles-form-test-controls"
	);

	return {
		...actual,
		VehicleFilterBuilder: VehicleFilterBuilderTestDouble,
	};
});

const savedVehicle = {
	revisionVehicleId: 1,
	vehicleCatalogId: 1001,
	year: 2026,
	make: "Chevrolet",
	model: "Silverado",
	trimName: "LT",
	segment: "Truck",
};

function renderVehiclesForm({
	mode = "edit",
	programStatus = "DRAFT",
	isMinorRevision = false,
}: {
	mode?: "new" | "edit";
	programStatus?: "DRAFT" | "ACTIVE";
	isMinorRevision?: boolean;
} = {}) {
	return render(
		<ProgramEditorProvider
			mode={mode}
			programId={mode === "edit" ? 42 : undefined}
			revisionId={mode === "edit" ? 420 : undefined}
			programStatus={mode === "edit" ? programStatus : undefined}
			isMinorRevision={isMinorRevision}
		>
			<VehiclesForm />
		</ProgramEditorProvider>,
	);
}

async function addVehicleRow({
	model = "Silverado",
	includeSegment = false,
}: {
	model?: string;
	includeSegment?: boolean;
} = {}) {
	fireEvent.click(screen.getByRole("button", { name: "2026" }));
	fireEvent.click(screen.getByRole("button", { name: "Chevrolet" }));
	fireEvent.click(screen.getByRole("button", { name: model }));
	fireEvent.click(screen.getByRole("button", { name: "Gasoline" }));

	if (includeSegment) {
		fireEvent.click(screen.getByRole("button", { name: "Truck" }));
	}

	fireEvent.click(screen.getByRole("button", { name: "Add row" }));
}

describe("VehiclesForm", () => {
	beforeEach(() => {
		mocks.resolveVehicleFilters.mockReset();
		mocks.updateVehicles.mockReset();
		mocks.programVehicles.mockReset();
		mocks.vehicleYears.mockReset();
		mocks.vehicleMakes.mockReset();
		mocks.vehicleCatalog.mockReset();

		mocks.resolveVehicleFilters.mockImplementation(
			async (rows: VehicleFilterRow[]) => ({
				rows: rows.map((row) => ({
					row,
					vehicleCatalogIds: rows.length > 0 ? [1001] : [],
				})),
				vehicleCatalogIds: rows.length > 0 ? [1001] : [],
			}),
		);
		mocks.updateVehicles.mockResolvedValue({ selectedVehicles: [] });
		mocks.programVehicles.mockReturnValue({
			data: { selectedVehicles: [] },
			isLoading: false,
			isError: false,
		});
		mocks.vehicleYears.mockReturnValue({
			data: { years: [2026] },
			isLoading: false,
		});
		mocks.vehicleMakes.mockReturnValue({
			data: [{ make: "Chevrolet", oemCode: "CHEV" }],
			isLoading: false,
		});
		mocks.vehicleCatalog.mockReturnValue({
			data: {
				vehicles: [
					{
						vehicleId: "silverado",
						vehicleCatalogId: 1001,
						year: 2026,
						make: "Chevrolet",
						model: "Silverado",
						trimName: "LT",
						bodyStyle: "Truck",
						segment: "Truck",
						fuelType: "Gasoline",
						drivetrain: "4WD",
					},
					{
						vehicleId: "equinox",
						vehicleCatalogId: 1002,
						year: 2026,
						make: "Chevrolet",
						model: "Equinox",
						trimName: "LT",
						bodyStyle: "SUV",
						segment: "SUV",
						fuelType: "Gasoline",
						drivetrain: "AWD",
					},
				],
			},
			isLoading: false,
		});
	});

	it("adds a row and persists resolved catalog IDs", async () => {
		renderVehiclesForm();

		await addVehicleRow();

		await waitFor(() => {
			expect(mocks.resolveVehicleFilters).toHaveBeenCalledWith([
				expect.objectContaining({
					modelYears: ["2026"],
					makes: ["Chevrolet"],
					models: ["Silverado"],
					fuelTypes: ["Gasoline"],
				}),
			]);
			expect(mocks.updateVehicles).toHaveBeenCalledWith({
				programId: 42,
				revisionId: 420,
				payload: { vehicleCatalogIds: [1001] },
			});
		});

		expect(screen.getByText(/MY 2026 · Make Chevrolet · Model Silverado/)).toBeInTheDocument();
	});

	it("does not persist a row when required filters are missing", async () => {
		renderVehiclesForm();

		fireEvent.click(screen.getByRole("button", { name: "Add row" }));

		expect(mocks.resolveVehicleFilters).not.toHaveBeenCalled();
		expect(mocks.updateVehicles).not.toHaveBeenCalled();
		expect(screen.queryByText(/MY /)).not.toBeInTheDocument();
	});

	it("updates an existing row after editing it", async () => {
		renderVehiclesForm();
		await addVehicleRow();

		await waitFor(() => {
			expect(screen.getByText(/MY 2026 · Make Chevrolet · Model Silverado/)).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole("button", { name: "Edit" }));
		fireEvent.click(screen.getByRole("button", { name: "Equinox" }));
		fireEvent.click(screen.getByRole("button", { name: "Update Row" }));

		await waitFor(() => {
			expect(mocks.updateVehicles).toHaveBeenLastCalledWith({
				programId: 42,
				revisionId: 420,
				payload: { vehicleCatalogIds: [1001] },
			});
			expect(screen.getByText(/Model Silverado, Equinox/)).toBeInTheDocument();
		});
	});

	it("deletes a row and persists the remaining selections", async () => {
		renderVehiclesForm();
		await addVehicleRow();

		await waitFor(() => {
			expect(screen.getByText(/MY 2026/)).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole("button", { name: "Remove vehicle row 1" }));

		await waitFor(() => {
			expect(mocks.resolveVehicleFilters).toHaveBeenLastCalledWith([]);
			expect(mocks.updateVehicles).toHaveBeenLastCalledWith({
				programId: 42,
				revisionId: 420,
				payload: { vehicleCatalogIds: [] },
			});
		});
		expect(screen.queryByText(/MY 2026/)).not.toBeInTheDocument();
	});

	it("preserves the wildcard as a row filter and resolves it without scalar filters", async () => {
		renderVehiclesForm();

		fireEvent.click(screen.getByRole("button", { name: "Any Model Year" }));
		fireEvent.click(screen.getByRole("button", { name: "Any Make" }));
		fireEvent.click(screen.getByRole("button", { name: "Any Model" }));
		fireEvent.click(screen.getByRole("button", { name: "Any Fuel Type" }));
		fireEvent.click(screen.getByRole("button", { name: "Add row" }));

		await waitFor(() => {
			expect(mocks.resolveVehicleFilters).toHaveBeenCalledWith([
				expect.objectContaining({
					modelYears: ["*"],
					makes: ["*"],
					models: ["*"],
					fuelTypes: ["*"],
				}),
			]);
		});
	});

	it("does not expose row editing actions in a read-only revision", async () => {
		renderVehiclesForm({ programStatus: "ACTIVE" });

		expect(screen.getByRole("button", { name: "Add row" })).toBeDisabled();
		expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "Remove vehicle row 1" }),
		).not.toBeInTheDocument();
	});

	it("does not expose editing actions for a minor revision", () => {
		renderVehiclesForm({ isMinorRevision: true });

		expect(screen.getByRole("button", { name: "Add row" })).toBeDisabled();
	});

	it("keeps the committed row when persistence fails", async () => {
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
		mocks.updateVehicles.mockRejectedValueOnce(new Error("Network unavailable"));

		renderVehiclesForm();
		await addVehicleRow();

		await waitFor(() => {
			expect(mocks.updateVehicles).toHaveBeenCalledTimes(1);
		});
		expect(screen.queryByText(/MY 2026/)).not.toBeInTheDocument();

		consoleError.mockRestore();
	});
});
