import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = resolve(__dirname, "./data/db.json");

export interface MockProgram {
	id: number;
	name: string;
	status: "DRAFT" | "ACTIVE" | "EXPIRED";
}

export interface MockRevision {
	id: number;
	programId: number;
	status: "DRAFT" | "REVIEW" | "APPROVED" | "ACTIVE" | "EXPIRED";
}
export interface MockActivity {
	id: number;
	entityType: "INCENTIVE_REVISION" | "INCENTIVE_PROGRAM";
	entityId: number;
	operation: string;
	changedBy: string;
	changedAt: string;
	programName: string;
	programIdentifier: string;
}

export interface MockExpiringProgram {
	programId: number;
	programIdentifier: string;
	programName: string;

	revisionId: number;
	revisionLabel: string;

	deliveryStartDate: string;
	deliveryEndDate: string;

	vehicles: Array<{
		vehicleCatalogId: number;
		label: string;
	}>;

	includedStates: string[];
}
export type MockProgramStatus = "DRAFT" | "ACTIVE" | "EXPIRED";

export interface MockProgram {
	id: number;
	identifier: string;
	name: string;
	status: MockProgramStatus;
}
export interface MockDb {
	programs: MockProgram[];
	revisions: MockRevision[];
	activity: MockActivity[];
	expiringPrograms: MockExpiringProgram[];
}

export async function readDb(): Promise<MockDb> {
	const content = await readFile(DB_PATH, "utf8");

	return JSON.parse(content) as MockDb;
}

export async function writeDb(db: MockDb): Promise<void> {
	await writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}
