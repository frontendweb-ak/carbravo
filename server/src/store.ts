// src/store.ts

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
export type ProgramStatus = "DRAFT" | "ACTIVE" | "EXPIRED";
export type RevisionStatus = "DRAFT" | "ACTIVE" | "EXPIRED";
export type UserRole = "AUTHOR" | "APPROVER" | "ADMIN";
export type GeoLevel = "REGION" | "STATE" | "DMA" | "COUNTY";
export type AttributeKey = "TERM_MONTHS" | "APR_RATE" | "CASH_AMOUNT";
export type AuditOperation =
	| "CREATE"
	| "UPDATE"
	| "SUBMIT"
	| "APPROVE"
	| "REJECT"
	| "REVISE"
	| "MINOR_REVISE"
	| "POST_TO_PRODUCTION"
	| "EXPIRE"
	| "DELETE";

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

export interface Setup {
	programName: string | null;
	programTypeCode: string | null;
	purchaseType: string | null;

	customerTypeCodes: string[];

	contactName: string | null;
	contactEmail: string | null;
	contactPhone: string | null;

	financialProviderCode: string | null;

	conditionCode: string | null;

	mileageCeiling: number | null;

	topOfDeal: boolean;
	vinException: boolean;

	mfpnText: string | null;
	disclosureText: string | null;

	localeCode: string;

	deliveryStartDate: string | null;
	deliveryEndDate: string | null;

	effectiveStartDate: string | null;
	effectiveEndDate: string | null;

	financeTerms: number[];

	creditTiers: string[];
}

export interface SelectedVehicle {
	revisionVehicleId: number;
	vehicleCatalogId: number;
}

export interface GeoRule {
	geoRuleId: number;
	isIncluded: boolean;
	level: GeoLevel;
	code: string;
	name?: string;
}

export interface Attribute {
	attributeId: number;
	key: AttributeKey;
	numberValue: number | null;
	textValue: string | null;
}

export interface Component {
	componentId: number;
	componentCode: string;
	componentName: string;
	sequenceNo: number;
	attributes: Attribute[];

	vehicleOverrides: Record<string, unknown>[];
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
	setup: Setup;
	vehicles: SelectedVehicle[];
	geography: GeoRule[];
	values: {
		financeTerms: number[];
		components: Component[];
	};
	summary: Record<string, unknown>;
	copiedFromRevisionId: number | null;
}
export interface ReferenceSetupData {
	programTypes: {
		code: string;
		name: string;
		supportsCash: boolean;
		supportsRate: boolean;
	}[];

	purchaseTypes: {
		code: string;
		name: string;
	}[];

	customerTypes: {
		code: string;
		name: string;
	}[];

	conditionCodes: {
		code: string;
		name: string;
	}[];

	financeTermOptions: {
		termMonths: number;
		label: string;
	}[];

	creditTierOptions: {
		code: string;
		name: string;
		sortOrder: number;
	}[];

	financialProviders: {
		code: string;
		name: string;
		isActive: boolean;
		supportedTerms: number[];
		supportsCash: boolean;
		supportsRate: boolean;
	}[];
}
export interface Vehicle {
	vehicleCatalogId: number;
	vehicleId: string;
	year: number;
	make: string;
	model: string;
	trimName: string;
	bodyStyle: string;
	segment: string;
	fuelType: string;
	drivetrain: string;
	oemCode: string;
}

export interface GeoNode {
	code: string;
	name: string;
}

export interface GeographyData {
	regions: GeoNode[];
	states: (GeoNode & { region: string })[];
	dmas: (GeoNode & { state: string; region: string })[];
	counties: (GeoNode & { state: string; dma?: string })[];
}

export interface ReferenceSetup {
	programTypes: {
		code: string;
		name: string;
		supportsCash: boolean;
		supportsRate: boolean;
	}[];
	purchaseTypes: { code: string; name: string }[];
	customerTypes: { code: string; name: string }[];
	conditionCodes: { code: string; name: string }[];
	financeTermOptions: { termMonths: number; label: string }[];
	creditTierOptions: { code: string; name: string; sortOrder: number }[];
	financialProviders: {
		code: string;
		name: string;
		isActive: boolean;
		supportedTerms: number[];
		supportsCash: boolean;
		supportsRate: boolean;
	}[];
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
	geography: GeographyData;
	referenceSetup: ReferenceSetup;
	activity: MockActivity[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const DB_PATH = resolve(__dirname, "./data/db.json");
let writeQueue: Promise<void> = Promise.resolve();
export async function readDb(): Promise<MockDb> {
	try {
		const content = await readFile(DB_PATH, "utf8");
		return JSON.parse(content) as MockDb;
	} catch {
		const empty: MockDb = {
			programs: [],
			revisions: [],
			vehicles: [],
			geography: {
				regions: [],
				states: [],
				dmas: [],
				counties: [],
			},
			referenceSetup: {
				programTypes: [],
				purchaseTypes: [],
				customerTypes: [],
				conditionCodes: [],
				financeTermOptions: [],
				creditTierOptions: [],
				financialProviders: [],
			},
			activity: [],
		};

		await mkdir(dirname(DB_PATH), { recursive: true });
		await writeFile(DB_PATH, JSON.stringify(empty, null, 2), "utf8");
		return empty;
	}
}

export async function writeDb(db: MockDb): Promise<void> {
	await mkdir(dirname(DB_PATH), { recursive: true });
	writeQueue = writeQueue.then(() =>
		writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8"),
	);
	return writeQueue;
}

export function getNextId(values: Array<{ id: number }>): number {
	if (!values.length) {
		return 1;
	}

	return Math.max(...values.map((item) => item.id)) + 1;
}

export function revisionLabel(
	revision: Pick<MockRevision, "majorRevision" | "minorRevision">,
): string {
	return `${revision.majorRevision}.${revision.minorRevision}`;
}
export function clone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T;
}
