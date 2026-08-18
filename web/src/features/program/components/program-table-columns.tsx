import type { ReactNode } from "react";

import type { Program } from "../model/programs.types";
import { getProgramTypeLabel } from "../utils";

import { ProgramDeliveryPeriod } from "./program-delivery-period";
import { ProgramIdentity } from "./program-identity";
import { ProgramRevision } from "./program-revision";
import { ProgramStatusBadge } from "./program-status-badge";

export interface ProgramTableColumn {
	id: string;
	label: ReactNode;
	width?: number | string;
	align?: "left" | "center" | "right";
	render: (program: Program) => ReactNode;
}

function getVehicleSummary(program: Program): string {
	if (program.vehicles.length === 0) {
		return "—";
	}

	return program.vehicles.map((vehicle) => vehicle.label).join(", ");
}

function getGeographySummary(program: Program): string {
	if (program.geography.length === 0) {
		return "—";
	}

	return program.geography.join(", ");
}

export const programTableColumns: ProgramTableColumn[] = [
	{
		id: "program",
		label: "Program",
		width: "21%",
		render: (program) => <ProgramIdentity program={program} />,
	},

	{
		id: "revision",
		label: "Rev",
		width: "50px",
		render: (program) => <ProgramRevision program={program} />,
	},

	{
		id: "type",
		label: "Type",
		width: "10.5%",
		render: (program) => <span>{getProgramTypeLabel(program.type)}</span>,
	},

	{
		id: "vehicles",
		label: "Vehicles",
		width: "15%",
		render: (program) => (
			<span title={getVehicleSummary(program)}>
				{getVehicleSummary(program)}
			</span>
		),
	},

	{
		id: "geography",
		label: "Geography",
		width: "12%",
		render: (program) => (
			<span title={getGeographySummary(program)}>
				{getGeographySummary(program)}
			</span>
		),
	},

	{
		id: "effective",
		label: "Effective",
		width: "10%",
		render: (program) => <ProgramDeliveryPeriod program={program} />,
	},

	{
		id: "status",
		label: "Status",
		width: "13%",
		render: (program) => <ProgramStatusBadge status={program.status} />,
	},
];
