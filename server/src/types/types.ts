// ---------------------------------------------------------------------------
// Domain types. These intentionally mirror components/schemas in openapi.yaml.
// If the contract changes, update these types (and only these types) to match.
// ---------------------------------------------------------------------------

export type ProgramStatus = "DRAFT" | "ACTIVE" | "EXPIRED";
export type RevisionStatus = "DRAFT" | "ACTIVE" | "EXPIRED";

export type ProgramTypeCode = "CUSTOMER_CASH" | "APR" | "BONUS_CASH";
export type PurchaseType = "CASH" | "FINANCE";
export type ConditionCode =
	| "CARBRAVO"
	| "MANUFACTURER_CERTIFIED"
	| "USED_INSPECTED"
	| "USED_AS_IS";
export type CreditTier = "A_PLUS" | "A1" | "A2" | "B";

export type AuditOperation =
	| "CREATE"
	| "UPDATE"
	| "SUBMIT"
	| "APPROVE"
	| "REJECT"
	| "REVISE"
	| "MINOR_REVISE"
	| "POST_TO_PRODUCTION"
	| "EXPIRE";

export type ErrorCode =
	| "REVISION_NOT_EDITABLE"
	| "DRAFT_ALREADY_EXISTS"
	| "APPROVAL_REQUIRED"
	| "ALREADY_APPROVED"
	| "NOT_SUBMITTED"
	| "PROGRAM_NOT_ACTIVE"
	| "PROGRAM_NOT_REVISABLE"
	| "MINOR_LIMIT_EXCEEDED"
	| "NO_INCLUDE_RULE"
	| "NOT_FOUND"
	| "VALIDATION_ERROR";

export interface SetupFields {
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

export interface VehicleSelection {
	revisionVehicleId: number;
	vehicleCatalogId: number;
}

export interface GeoRuleRecord {
	geoRuleId: number;
	isIncluded: boolean;
	level: "REGION" | "STATE" | "DMA" | "COUNTY";
	code: string;
	name: string;
}

export interface AttributeRecord {
	attributeId: number;
	key: "TERM_MONTHS" | "APR_RATE" | "CASH_AMOUNT";
	numberValue: number | null;
	textValue: string | null;
}

export interface ComponentRecord {
	componentId: number;
	componentCode: string;
	componentName: string;
	sequenceNo: number;
	attributes: AttributeRecord[];
	vehicleOverrides: unknown[];
}

export interface Revision {
	id: number;
	programId: number;
	majorRevision: number;
	minorRevision: number;
	revisionStatus: RevisionStatus;
	isMinorRevision: boolean;

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

	postedAt: string | null;
	postedBy: string | null;

	createdAt: string;
	createdBy: string;

	copiedFromRevisionId: number | null;

	setup: SetupFields;
	vehicles: VehicleSelection[];
	geoRules: GeoRuleRecord[];
	components: ComponentRecord[];
}

export interface Program {
	id: number;
	identifier: string;
	name: string;
	status: ProgramStatus;
	programType: ProgramTypeCode | null;
	deliveryStartDate: string | null;
	deliveryEndDate: string | null;
	updatedAt: string;
	deleted: boolean;
}

export interface ActivityEvent {
	id: number;
	entityType: "INCENTIVE_REVISION" | "INCENTIVE_PROGRAM";
	entityId: number;
	operation: AuditOperation;
	changedBy: string;
	changedAt: string;
	comment: string | null;
	programId: number;
	programName: string;
	programIdentifier: string;
}

export interface Counters {
	program: number;
	revision: number;
	geoRule: number;
	component: number;
	attribute: number;
	activity: number;
	vehicleSelection: number;
}

export interface Db {
	programs: Program[];
	revisions: Revision[];
	activity: ActivityEvent[];
	counters: Counters;
}

export interface AuthedUser {
	username: string;
	role: "AUTHOR" | "APPROVER" | "ADMIN";
}