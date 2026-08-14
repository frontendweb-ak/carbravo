// src/store.ts

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * ============================================================
 * OpenAPI domain enums
 * ============================================================
 */

export type ProgramStatus =
	| "DRAFT"
	| "ACTIVE"
	| "EXPIRED";

export type RevisionStatus =
	| "DRAFT"
	| "ACTIVE"
	| "EXPIRED";

export type UserRole =
	| "AUTHOR"
	| "APPROVER"
	| "ADMIN";

export type GeoLevel =
	| "REGION"
	| "STATE"
	| "DMA"
	| "COUNTY";

export type AttributeKey =
	| "TERM_MONTHS"
	| "APR_RATE"
	| "CASH_AMOUNT";

export type ProgramTypeCode =
	| "CUSTOMER_CASH"
	| "APR"
	| "BONUS_CASH";

export type PurchaseType =
	| "CASH"
	| "FINANCE";

export type ConditionCode =
	| "CARBRAVO"
	| "MANUFACTURER_CERTIFIED"
	| "USED_INSPECTED"
	| "USED_AS_IS";

export type CreditTier =
	| "A_PLUS"
	| "A1"
	| "A2"
	| "B";

/**
 * ============================================================
 * OpenAPI AuditOperation
 * ============================================================
 *
 * Keep this aligned with the AuditOperation enum in
 * openapi.yaml.
 */

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

/**
 * ============================================================
 * Approval
 * ============================================================
 *
 * Internal persistence object.
 *
 * The HTTP ApprovalState response is richer than this object
 * in the OpenAPI contract because the API can combine approval
 * information with revision metadata.
 */

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

/**
 * ============================================================
 * Program
 * ============================================================
 *
 * Internal persistence model.
 *
 * API ProgramListItem / ProgramDetail are mapped from this
 * object by route/lib mappers.
 */

export interface MockProgram {
	id: number;

	identifier: string;

	name: string;

	status: ProgramStatus;

	/**
	 * OpenAPI ProgramListItem / ProgramDetail expose this
	 * as a string.
	 *
	 * The Setup revision stores the more specific
	 * ProgramTypeCode.
	 */
	programType: string;

	activeRevisionId: number | null;

	draftRevisionId: number | null;

	deliveryStartDate: string | null;

	deliveryEndDate: string | null;

	createdAt: string;

	updatedAt: string;

	deletedAt: string | null;
}

/**
 * ============================================================
 * Setup
 * ============================================================
 *
 * This is the persistence representation of SetupInput.
 *
 * Important:
 * - Required API fields are nullable internally because a
 *   newly-created DRAFT can legitimately start empty.
 * - Once PUT /setup succeeds, the required fields are populated.
 * - Enums are kept strict so invalid mock data cannot silently
 *   enter the store.
 *
 * OpenAPI SetupInput:
 * programTypeCode:
 * CUSTOMER_CASH | APR | BONUS_CASH
 *
 * purchaseType:
 * CASH | FINANCE
 *
 * conditionCode:
 * CARBRAVO | MANUFACTURER_CERTIFIED |
 * USED_INSPECTED | USED_AS_IS
 *
 * creditTiers:
 * A_PLUS | A1 | A2 | B
 */

export interface Setup {
	programName: string | null;

	programTypeCode: ProgramTypeCode | null;

	purchaseType: PurchaseType | null;

	customerTypeCodes: string[];

	contactName: string | null;

	contactEmail: string | null;

	contactPhone: string | null;

	financialProviderCode: string | null;

	conditionCode: ConditionCode | null;

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

	creditTiers: CreditTier[];
}

/**
 * ============================================================
 * Vehicle targeting
 * ============================================================
 *
 * OpenAPI Vehicle contains:
 * vehicleCatalogId
 * vehicleId
 * year
 * make
 * model
 * trimName
 * bodyStyle
 * segment
 * fuelType
 * drivetrain
 *
 * oemCode is NOT part of the OpenAPI Vehicle schema.
 *
 * However, the mock catalog currently needs oemCode for the
 * /vehicles/makes endpoint and /vehicles/search?oemCode.
 *
 * Therefore it remains an internal catalog field.
 */

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

	/**
	 * Internal catalog/reference field.
	 *
	 * Used by:
	 * GET /vehicles/makes
	 * GET /vehicles/search?oemCode
	 */
	oemCode: string;
}

/**
 * Selected vehicle persisted on a revision.
 *
 * The API SelectedVehicle is richer:
 *
 * revisionVehicleId
 * vehicleCatalogId
 * year
 * make
 * model
 * trimName
 * segment
 *
 * The remaining vehicle information is resolved from the
 * vehicle catalog when producing the API response.
 */

export interface SelectedVehicle {
	revisionVehicleId: number;

	vehicleCatalogId: number;
}

/**
 * ============================================================
 * Geography
 * ============================================================
 */

export interface GeoNode {
	code: string;

	name: string;
}

export interface GeographyData {
	regions: GeoNode[];

	states: Array<
		GeoNode & {
			region: string;
		}
	>;

	dmas: Array<
		GeoNode & {
			state: string;
			region: string;
		}
	>;

	counties: Array<
		GeoNode & {
			state: string;
			dma?: string;
		}
	>;
}

/**
 * OpenAPI GeoRule.
 *
 * geoRuleId is generated by the server/store.
 */

export interface GeoRule {
	geoRuleId: number;

	isIncluded: boolean;

	level: GeoLevel;

	code: string;

	name?: string;
}

/**
 * ============================================================
 * Incentive values
 * ============================================================
 */

/**
 * OpenAPI Attribute.
 */

export interface Attribute {
	attributeId: number;

	key: AttributeKey;

	numberValue: number | null;

	textValue: string | null;
}

/**
 * OpenAPI Component.
 *
 * vehicleOverrides is intentionally generic because the
 * OpenAPI contract defines it as:
 *
 * array<object>
 */

export interface Component {
	componentId: number;

	componentCode: string;

	componentName: string;

	sequenceNo: number;

	attributes: Attribute[];

	vehicleOverrides: Record<string, unknown>[];
}

/**
 * Values persistence model.
 *
 * This maps directly to the OpenAPI ValuesResponse at the
 * top-level after scopeVehicles is resolved from revision.vehicles.
 */

export interface RevisionValues {
	financeTerms: number[];

	components: Component[];
}

/**
 * ============================================================
 * Revision
 * ============================================================
 */

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

	values: RevisionValues;

	/**
	 * Completion/summary information is an internal
	 * persistence snapshot.
	 *
	 * The Summary API maps this into the OpenAPI Summary DTO.
	 */
	summary: Record<string, unknown>;

	/**
	 * Revision lifecycle relationship.
	 */
	copiedFromRevisionId: number | null;
}

/**
 * ============================================================
 * Reference data
 * ============================================================
 */

/**
 * Program type reference item.
 *
 * This corresponds to the ReferenceSetup contract.
 */

export interface ReferenceProgramType {
	code: string;

	name: string;

	supportsCash: boolean;

	supportsRate: boolean;
}

export interface ReferencePurchaseType {
	code: string;

	name: string;
}

export interface ReferenceCustomerType {
	code: string;

	name: string;
}

export interface ReferenceConditionCode {
	code: string;

	name: string;
}

export interface ReferenceFinanceTermOption {
	termMonths: number;

	label: string;
}

export interface ReferenceCreditTierOption {
	code: string;

	name: string;

	sortOrder: number;
}

export interface ReferenceFinancialProvider {
	code: string;

	name: string;

	isActive: boolean;

	supportedTerms: number[];

	supportsCash: boolean;

	supportsRate: boolean;
}

/**
 * Keep ReferenceSetupData as an alias for existing imports.
 */

export interface ReferenceSetupData {
	programTypes: ReferenceProgramType[];

	purchaseTypes: ReferencePurchaseType[];

	customerTypes: ReferenceCustomerType[];

	conditionCodes: ReferenceConditionCode[];

	financeTermOptions: ReferenceFinanceTermOption[];

	creditTierOptions: ReferenceCreditTierOption[];

	financialProviders: ReferenceFinancialProvider[];
}

export type ReferenceSetup = ReferenceSetupData;

/**
 * ============================================================
 * Activity
 * ============================================================
 *
 * This matches the OpenAPI ActivityItem.
 */

export interface MockActivity {
	id: number;

	entityType:
		| "INCENTIVE_REVISION"
		| "INCENTIVE_PROGRAM";

	entityId: number;

	operation: AuditOperation;

	changedBy: string;

	changedAt: string;

	programName: string;

	programIdentifier: string;
}

/**
 * ============================================================
 * Database
 * ============================================================
 */

export interface MockDb {
	programs: MockProgram[];

	revisions: MockRevision[];

	vehicles: Vehicle[];

	geography: GeographyData;

	referenceSetup: ReferenceSetup;

	activity: MockActivity[];
}

/**
 * ============================================================
 * Database file
 * ============================================================
 */

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

export const DB_PATH = resolve(
	__dirname,
	"./data/db.json",
);

/**
 * Serialize writes so concurrent mutations cannot overwrite
 * one another.
 */

let writeQueue: Promise<void> =
	Promise.resolve();

/**
 * ============================================================
 * Read database
 * ============================================================
 */

export async function readDb(): Promise<MockDb> {
	try {
		const content = await readFile(
			DB_PATH,
			"utf8",
		);

		return JSON.parse(
			content,
		) as MockDb;
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

		await mkdir(
			dirname(DB_PATH),
			{ recursive: true },
		);

		await writeFile(
			DB_PATH,
			JSON.stringify(
				empty,
				null,
				2,
			),
			"utf8",
		);

		return empty;
	}
}

/**
 * ============================================================
 * Write database
 * ============================================================
 */

export async function writeDb(
	db: MockDb,
): Promise<void> {
	await mkdir(
		dirname(DB_PATH),
		{ recursive: true },
	);

	writeQueue = writeQueue.then(() =>
		writeFile(
			DB_PATH,
			JSON.stringify(
				db,
				null,
				2,
			),
			"utf8",
		),
	);

	return writeQueue;
}

/**
 * ============================================================
 * ID generation
 * ============================================================
 *
 * Existing code calls this with objects containing `id`.
 *
 * Keep it for compatibility with programs, revisions and
 * activity.
 */

export function getNextId(
	values: Array<{ id: number }>,
): number {
	if (!values.length) {
		return 1;
	}

	return (
		Math.max(
			...values.map(
				(item) => item.id,
			),
		) + 1
	);
}

/**
 * ============================================================
 * Revision label
 * ============================================================
 */

export function revisionLabel(
	revision: Pick<
		MockRevision,
		"majorRevision" | "minorRevision"
	>,
): string {
	return `${revision.majorRevision}.${revision.minorRevision}`;
}

/**
 * ============================================================
 * Deep clone
 * ============================================================
 */

export function clone<T>(
	value: T,
): T {
	return JSON.parse(
		JSON.stringify(value),
	) as T;
}