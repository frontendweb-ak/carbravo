import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const DB_PATH = resolve(__dirname, "./data/db.json");

export type ProgramStatus = "DRAFT" | "ACTIVE" | "EXPIRED";

export type RevisionStatus = "DRAFT" | "ACTIVE" | "EXPIRED";

export type UserRole = "AUTHOR" | "APPROVER" | "ADMIN";

export type AuditOperation =
	| "CREATE"
	| "UPDATE"
	| "SUBMIT"
	| "APPROVE"
	| "REJECT"
	| "PUBLISH"
	| "REVISE"
	| "MINOR_REVISE"
	| "EXPIRE"
	| "DELETE";

export type GeoLevel = "REGION" | "STATE" | "DMA" | "COUNTY";

export interface MockProgram {
	id: number;
	identifier: string;
	name: string;
	status: ProgramStatus;

	programType: string;

	activeRevisionId: number | null;
	draftRevisionId: number | null;

	deliveryStartDate: string | null;
	deliveryEndDate: string | null;

	createdAt: string;
	updatedAt: string;

	deletedAt: string | null;
}

export interface ApprovalState {
	revisionId: number;

	isSubmitted: boolean;
	submittedAt: string | null;
	submittedBy: string | null;

	approved: boolean;
	approvedAt: string | null;
	approvedBy: string | null;
	approvalComment: string | null;

	rejectedAt: string | null;
	rejectedBy: string | null;
	rejectionReason: string | null;
}

export interface MockRevision {
	id: number;
	programId: number;

	majorRevision: number;
	minorRevision: number;

	status: RevisionStatus;

	isMinorRevision: boolean;

	createdAt: string;
	createdBy: string;

	postedAt: string | null;
	postedBy: string | null;

	approval: ApprovalState;

	/**
	 * Complete revision snapshot.
	 *
	 * Keeping these sections together makes the temporary backend
	 * easy to replace with a real relational backend later.
	 */
	setup: Record<string, unknown>;

	vehicles: number[];

	geography: GeoRule[];

	values: Record<string, unknown>;

	summary: Record<string, unknown>;
}

export interface Vehicle {
	vehicleCatalogId: number;
	year: number;
	make: string;
	model: string;
	division: string;
	segment: string;
	fuelType: string;
	oemCode: string;
	label: string;
}

export interface GeoNode {
	code: string;
	name: string;
}

export interface GeoRule {
	geoRuleId: number;
	isIncluded: boolean;
	level: GeoLevel;
	code: string;
	name?: string;
}

export interface MockActivity {
	id: number;
	entityType: "INCENTIVE_REVISION" | "INCENTIVE_PROGRAM";
	entityId: number;
	operation: AuditOperation;
	changedBy: string;
	changedAt: string;
	programName: string;
	programIdentifier: string;
}

export interface MockDb {
	programs: MockProgram[];
	revisions: MockRevision[];
	vehicles: Vehicle[];
	activity: MockActivity[];
	geoRules: Record<string, GeoRule[]>;
}

const EMPTY_DB: MockDb = {
	programs: [],
	revisions: [],
	vehicles: [],
	activity: [],
	geoRules: {},
};

export async function readDb(): Promise<MockDb> {
	try {
		const content = await readFile(DB_PATH, "utf8");

		return {
			...EMPTY_DB,
			...JSON.parse(content),
		};
	} catch {
		await mkdir(dirname(DB_PATH), { recursive: true });

		await writeFile(DB_PATH, JSON.stringify(EMPTY_DB, null, 2), "utf8");

		return structuredClone(EMPTY_DB);
	}
}

export async function writeDb(db: MockDb): Promise<void> {
	await mkdir(dirname(DB_PATH), { recursive: true });

	await writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export function getNextId(values: Array<{ id: number }>): number {
	if (values.length === 0) {
		return 1;
	}

	return Math.max(...values.map((item) => item.id)) + 1;
}

export function revisionLabel(
	revision: Pick<MockRevision, "majorRevision" | "minorRevision">,
) {
	return `${revision.majorRevision}.${revision.minorRevision}`;
}
