import { Badge, Button, Card, CardContent } from "@/components/ui";
import { CalendarDays, ChevronRight } from "lucide-react";

export interface ProgramListProps {
	programs: Program[];
	isFetching?: boolean;
	onProgramClick?: (programId: number) => void;
}

function ProgramList({
	programs,
	isFetching = false,
	onProgramClick,
}: ProgramListProps) {
	return (
		<Card className="overflow-hidden">
			<CardContent className="p-0">
				{/* Keep the current content visible while a filter/page
				    request is running. */}
				{isFetching && (
					<div
						aria-hidden="true"
						className="h-0.5 w-full overflow-hidden bg-muted"
					>
						<div className="h-full w-1/3 animate-pulse bg-primary" />
					</div>
				)}

				{/* Desktop */}
				<div className="hidden md:block">
					<ProgramTable programs={programs} onProgramClick={onProgramClick} />
				</div>

				{/* Mobile */}
				<div className="divide-y md:hidden">
					{programs.map((program) => (
						<ProgramMobileCard
							key={program.id}
							program={program}
							onClick={
								onProgramClick ? () => onProgramClick(program.id) : undefined
							}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

/* -------------------------------------------------------------------------- */
/* Desktop table                                                               */
/* -------------------------------------------------------------------------- */

interface ProgramTableProps {
	programs: Program[];
	onProgramClick?: (programId: number) => void;
}

function ProgramTable({ programs, onProgramClick }: ProgramTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse">
				<caption className="sr-only">Incentive programs</caption>

				<thead>
					<tr className="border-b bg-muted/30 text-left">
						<th
							scope="col"
							className="px-5 py-3 text-xs font-semibold text-muted-foreground"
						>
							Program
						</th>

						<th
							scope="col"
							className="px-4 py-3 text-xs font-semibold text-muted-foreground"
						>
							Type
						</th>

						<th
							scope="col"
							className="px-4 py-3 text-xs font-semibold text-muted-foreground"
						>
							Revision
						</th>

						<th
							scope="col"
							className="px-4 py-3 text-xs font-semibold text-muted-foreground"
						>
							Delivery period
						</th>

						<th
							scope="col"
							className="px-4 py-3 text-xs font-semibold text-muted-foreground"
						>
							Status
						</th>

						<th scope="col" className="w-12 px-3 py-3">
							<span className="sr-only">Open</span>
						</th>
					</tr>
				</thead>

				<tbody className="divide-y">
					{programs.map((program) => (
						<ProgramTableRow
							key={program.id}
							program={program}
							onClick={
								onProgramClick ? () => onProgramClick(program.id) : undefined
							}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Desktop row                                                                 */
/* -------------------------------------------------------------------------- */

interface ProgramTableRowProps {
	program: Program;
	onClick?: () => void;
}

function ProgramTableRow({ program, onClick }: ProgramTableRowProps) {
	const canOpen = Boolean(onClick);

	return (
		<tr
			className={
				canOpen ? "group transition-colors hover:bg-muted/30" : undefined
			}
		>
			{/* Program */}
			<td className="px-5 py-4">
				{canOpen ? (
					<button
						type="button"
						onClick={onClick}
						className="block min-w-0 max-w-full text-left outline-none"
					>
						<ProgramIdentity program={program} />
					</button>
				) : (
					<ProgramIdentity program={program} />
				)}
			</td>

			{/* Type */}
			<td className="px-4 py-4">
				<span className="text-sm text-foreground">
					{getProgramTypeLabel(program.type)}
				</span>
			</td>

			{/* Revision */}
			<td className="px-4 py-4">
				<RevisionInfo program={program} />
			</td>

			{/* Delivery */}
			<td className="px-4 py-4">
				<DeliveryPeriod program={program} />
			</td>

			{/* Status */}
			<td className="px-4 py-4">
				<ProgramStatusBadge status={program.status} />
			</td>

			{/* Action */}
			<td className="px-3 py-4">
				{canOpen && (
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label={`Open ${program.name || "program"}`}
						className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
						onClick={onClick}
					>
						<ChevronRight aria-hidden="true" className="size-4" />
					</Button>
				)}
			</td>
		</tr>
	);
}

/* -------------------------------------------------------------------------- */
/* Program identity                                                            */
/* -------------------------------------------------------------------------- */

function ProgramIdentity({ program }: { program: Program }) {
	return (
		<div className="min-w-0">
			<div className="flex min-w-0 items-center gap-2">
				<span className="truncate text-sm font-semibold text-foreground">
					{program.name || "Untitled program"}
				</span>

				{program.hasDraft && (
					<Badge variant="statusDraft" className="shrink-0">
						Draft revision
					</Badge>
				)}
			</div>

			<p className="mt-0.5 truncate text-xs text-muted-foreground">
				{program.identifier || "—"}
			</p>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Revision                                                                    */
/* -------------------------------------------------------------------------- */

function RevisionInfo({ program }: { program: Program }) {
	const revision = program.revision;

	return (
		<div className="flex flex-col">
			<span className="text-sm font-medium text-foreground">
				{revision?.label ?? "—"}
			</span>

			{revision?.isMinorRevision && (
				<span className="text-xs text-muted-foreground">Minor revision</span>
			)}

			{revision?.isSubmitted && !revision.approved && (
				<span className="text-xs text-status-review">Pending approval</span>
			)}
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Delivery period                                                             */
/* -------------------------------------------------------------------------- */

function DeliveryPeriod({ program }: { program: Program }) {
	return (
		<div className="flex items-center gap-1.5 text-sm text-foreground">
			<CalendarDays
				aria-hidden="true"
				className="size-3.5 shrink-0 text-muted-foreground"
			/>

			<span className="whitespace-nowrap">
				{formatProgramDate(program.deliveryStartDate)}
				{" – "}
				{formatProgramDate(program.deliveryEndDate)}
			</span>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Mobile                                                                      */
/* -------------------------------------------------------------------------- */

interface ProgramMobileCardProps {
	program: Program;
	onClick?: () => void;
}

function ProgramMobileCard({ program, onClick }: ProgramMobileCardProps) {
	if (!onClick) {
		return <ProgramMobileContent program={program} />;
	}

	return (
		<button
			type="button"
			className="flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-muted/30 focus-visible:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
			onClick={onClick}
		>
			<ProgramMobileContent program={program} />

			<ChevronRight
				aria-hidden="true"
				className="mt-1 size-4 shrink-0 text-muted-foreground"
			/>
		</button>
	);
}

function ProgramMobileContent({ program }: { program: Program }) {
	return (
		<div className="min-w-0 flex-1">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="truncate text-sm font-semibold text-foreground">
						{program.name || "Untitled program"}
					</p>

					<p className="mt-0.5 truncate text-xs text-muted-foreground">
						{program.identifier || "—"}
					</p>
				</div>

				<ProgramStatusBadge status={program.status} />
			</div>

			<div className="mt-3 grid grid-cols-2 gap-3 text-xs">
				<div>
					<p className="text-muted-foreground">Type</p>

					<p className="mt-0.5 font-medium text-foreground">
						{getProgramTypeLabel(program.type)}
					</p>
				</div>

				<div>
					<p className="text-muted-foreground">Revision</p>

					<p className="mt-0.5 font-medium text-foreground">
						{program.revision?.label ?? "—"}
					</p>
				</div>

				<div className="col-span-2">
					<p className="text-muted-foreground">Delivery period</p>

					<p className="mt-0.5 font-medium text-foreground">
						{formatProgramDate(program.deliveryStartDate)}
						{" – "}
						{formatProgramDate(program.deliveryEndDate)}
					</p>
				</div>

				{program.hasDraft && (
					<div className="col-span-2">
						<span className="text-xs font-medium text-status-draft">
							Draft revision available
						</span>
					</div>
				)}
			</div>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Date                                                                        */
/* -------------------------------------------------------------------------- */

function formatProgramDate(value: string | null): string {
	if (!value) {
		return "—";
	}

	return formatProgramDateValue(value);
}

function formatProgramDateValue(value: string): string {
	return formatProgramDateFromUtils(value);
}

/*
 * Keep the actual date formatting in the shared utility.
 *
 * This small indirection is intentionally isolated so this component
 * never owns date parsing/formatting rules.
 */
import { formatProgramDate as formatProgramDateFromUtils } from "@/utils";
import type { Program } from "../model/programs.types";
import { getProgramTypeLabel } from "../utils";
import { ProgramStatusBadge } from "./program-status-badge";

/* -------------------------------------------------------------------------- */
/* Export                                                                      */
/* -------------------------------------------------------------------------- */

export { ProgramList };
