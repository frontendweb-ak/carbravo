import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { SelectedVehiclesSection } from "../components/vehicle";
import { vehiclesDefaultValues } from "../constants";
import { useProgramEditor } from "../editor/program-editor-context";
import { useProgramVehicles } from "../hooks/use-program-vehicles";
import { vehiclesFormSchema, type VehiclesFormValues } from "../schema";
import { useVehicleFilterOptions } from "./use-vehicle-filter-options";
import { useVehicleRowEditor } from "./use-vehicle-row-editor";
import { VehicleFilterFields } from "./vehicle-filter-fields";

export function VehiclesForm() {
	const {
		programId,
		revisionId,
		isReadOnly,
		isMinorRevision,
		setSaveStatus,
	} = useProgramEditor();
	const canEdit = !isReadOnly && !isMinorRevision;

	const form = useForm<VehiclesFormValues>({
		resolver: zodResolver(vehiclesFormSchema),
		defaultValues: vehiclesDefaultValues,
		mode: "onBlur",
	});
	const rows = useVehicleRowEditor({
		form,
		programId,
		revisionId,
		canEdit,
		setSaveStatus,
	});
	const options = useVehicleFilterOptions(rows.currentRow, form);
	const { data: savedVehiclesResponse } = useProgramVehicles(programId, revisionId);
	const savedVehicles = savedVehiclesResponse?.selectedVehicles ?? [];

	return (
		<FormProvider {...form}>
			<Box
				component="form"
				onSubmit={form.handleSubmit(rows.onCommitRow, () => setSaveStatus("invalid"))}
				sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
			>
				<VehicleFilterFields
					form={form}
					currentRow={rows.currentRow}
					yearOptions={options.yearOptions}
					makeOptions={options.makeOptions}
					modelOptions={options.modelOptions}
					fuelOptions={options.fuelOptions}
					segmentOptions={options.segmentOptions}
					yearsLoading={options.yearsLoading}
					makesLoading={options.makesLoading}
					catalogLoadingState={options.catalogLoadingState}
					disabled={!canEdit}
					editing={rows.editingIndex !== null}
					onCancelEdit={rows.onCancelEdit}
				/>
				<SelectedVehiclesSection
					rows={rows.selectedRows}
					onEdit={canEdit ? rows.onEditRow : undefined}
					onDelete={canEdit ? rows.onDeleteRow : undefined}
				/>
				{savedVehicles.length > 0 && (
					<Box sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 2 }}>
						<Typography variant="subtitle2" sx={{ mb: 1 }}>
							Saved catalog vehicles ({savedVehicles.length})
						</Typography>
						<Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
							{savedVehicles.map((vehicle) => (
								<Chip
									key={vehicle.vehicleCatalogId}
									label={[`${vehicle.year} ${vehicle.make} ${vehicle.model}`, vehicle.trimName]
										.filter(Boolean)
										.join(" · ")}
									size="small"
									variant="outlined"
								/>
							))}
						</Stack>
					</Box>
				)}
			</Box>
		</FormProvider>
	);
}
