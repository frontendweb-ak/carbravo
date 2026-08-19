import { z } from "zod";

export const vehicleFilterRowSchema = z.object({
	modelYears: z.array(z.string()),
	makes: z.array(z.string()),
	models: z.array(z.string()),
	fuelTypes: z.array(z.string()),
	segments: z.array(z.string()),
});

export const vehiclesFormSchema = z.object({
	currentRow: vehicleFilterRowSchema,
	selectedRows: z.array(vehicleFilterRowSchema),
});

export type VehicleFilterRow = z.infer<typeof vehicleFilterRowSchema>;
export type VehiclesFormValues = z.infer<typeof vehiclesFormSchema>;
