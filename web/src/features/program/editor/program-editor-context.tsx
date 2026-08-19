import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

export type ProgramEditorMode = "new" | "edit";
export type ProgramWorkflowStatus =
	| "DRAFT"
	| "SUBMITTED"
	| "APPROVED"
	| "ACTIVE"
	| "EXPIRED";
export type ProgramSectionStatus = "pending" | "warning" | "completed";
export interface ProgramEditorSection {
	id: string;
	number: number;
	label: string;
	status: ProgramSectionStatus;
	requiredForSubmission: boolean;
}
export interface ProgramIdentity {
	programId: number;
	revisionId: number;
	programIdentifier?: string;
	programName?: string;
	revisionLabel?: string;
}

export interface ProgramEditorContextValue {
	mode: ProgramEditorMode;
	programId?: number;
	revisionId?: number;
	programIdentifier?: string;
	programName?: string;
	revisionLabel?: string;
	setProgramIdentity: (identity: ProgramIdentity) => void;
	programStatus?: ProgramWorkflowStatus;
	isSubmitted: boolean;
	approved: boolean;
	sections: ProgramEditorSection[];
	completion: number;
	activeSection: string;
	setActiveSection: (sectionId: string) => void;
	updateSectionStatus: (
		sectionId: string,
		status: ProgramSectionStatus,
	) => void;
	saveCurrentSection: () => Promise<void>;
	registerSaveHandler: (handler: (() => Promise<void>) | null) => void;
	setSectionSaving: (saving: boolean) => void;
	isSaving: boolean;
	isReadOnly: boolean;
}

/* -------------------------------------------------------------------------- */
/* Static section definitions                                                 */
/* -------------------------------------------------------------------------- */

export const PROGRAM_EDITOR_SECTION_DEFINITIONS = [
	{
		id: "setup",
		number: 1,
		label: "Setup",
		requiredForSubmission: true,
	},
	{
		id: "vehicles",
		number: 2,
		label: "Vehicles",
		requiredForSubmission: true,
	},
	{
		id: "geography",
		number: 3,
		label: "Geography",
		requiredForSubmission: true,
	},
	{
		id: "eligibility",
		number: 4,
		label: "Eligibility",
		requiredForSubmission: true,
	},
	{
		id: "incentive-values",
		number: 5,
		label: "Incentive Values",
		requiredForSubmission: true,
	},
	{
		id: "marketing",
		number: 6,
		label: "Marketing & Disclosures",
		requiredForSubmission: true,
	},
	{
		id: "summary",
		number: 7,
		label: "10-Point Summary",
		requiredForSubmission: true,
	},
	{
		id: "approval",
		number: 8,
		label: "Approval",
		requiredForSubmission: false,
	},
] as const;

function createInitialSections(): ProgramEditorSection[] {
	return PROGRAM_EDITOR_SECTION_DEFINITIONS.map((section) => ({
		...section,
		status: "pending",
	}));
}

/* -------------------------------------------------------------------------- */
/* Completion                                                                 */
/* -------------------------------------------------------------------------- */

function calculateCompletion(sections: ProgramEditorSection[]): number {
	const requiredSections = sections.filter(
		(section) => section.requiredForSubmission,
	);

	if (requiredSections.length === 0) {
		return 0;
	}

	const completedSections = requiredSections.filter(
		(section) => section.status === "completed",
	).length;

	return Math.round((completedSections / requiredSections.length) * 100);
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

const ProgramEditorContext = createContext<ProgramEditorContextValue | null>(
	null,
);

/* -------------------------------------------------------------------------- */
/* Provider props                                                             */
/* -------------------------------------------------------------------------- */

export interface ProgramEditorProviderProps {
	children: ReactNode;

	mode: ProgramEditorMode;

	programId?: number;
	revisionId?: number;

	programIdentifier?: string;
	programName?: string;
	revisionLabel?: string;

	/**
	 * Workflow status of the revision currently being edited.
	 *
	 * IMPORTANT:
	 * This is revision status, not the parent program status.
	 *
	 * Example:
	 *
	 * Program:
	 *   ACTIVE
	 *
	 * Draft revision:
	 *   DRAFT
	 *
	 * The editor must remain editable because the DRAFT revision
	 * is the working copy.
	 */
	programStatus?: ProgramWorkflowStatus;
	initialSections?: ProgramEditorSection[];
}

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

export function ProgramEditorProvider({
	children,
	mode,
	programId: initialProgramId,
	revisionId: initialRevisionId,
	programIdentifier: initialProgramIdentifier,
	programName: initialProgramName,
	revisionLabel: initialRevisionLabel,
	programStatus: initialProgramStatus,
	initialSections,
}: ProgramEditorProviderProps) {
	// Identity
	const [programId, setProgramId] = useState<number | undefined>(
		initialProgramId,
	);
	const [revisionId, setRevisionId] = useState<number | undefined>(
		initialRevisionId,
	);
	const [programIdentifier, setProgramIdentifier] = useState<
		string | undefined
	>(initialProgramIdentifier);

	const [programName, setProgramName] = useState<string | undefined>(
		initialProgramName,
	);

	const [revisionLabel, setRevisionLabel] = useState<string | undefined>(
		initialRevisionLabel,
	);
	const [programStatus, setProgramStatus] = useState<
		ProgramWorkflowStatus | undefined
	>(initialProgramStatus);

	useEffect(() => {
		setProgramId(initialProgramId);
		setRevisionId(initialRevisionId);
		setProgramIdentifier(initialProgramIdentifier);
		setProgramName(initialProgramName);
		setRevisionLabel(initialRevisionLabel);
		setProgramStatus(initialProgramStatus);
	}, [
		initialProgramId,
		initialRevisionId,
		initialProgramIdentifier,
		initialProgramName,
		initialRevisionLabel,
		initialProgramStatus,
	]);

	/* ---------------------------------------------------------------------- */
	/* Active section                                                         */
	/* ---------------------------------------------------------------------- */
	const [activeSection, setActiveSectionState] = useState("setup");
	/* ---------------------------------------------------------------------- */
	/* Section state                                                          */
	/* ---------------------------------------------------------------------- */
	const [sections, setSections] = useState<ProgramEditorSection[]>(
		() => initialSections ?? createInitialSections(),
	);

	/* ---------------------------------------------------------------------- */
	/* Saving                                                                 */
	/* ---------------------------------------------------------------------- */
	const [isSaving, setIsSaving] = useState(false);
	const saveHandlerRef = useRef<(() => Promise<void>) | null>(null);

	const setSectionSaving = useCallback((saving: boolean) => {
		setIsSaving(saving);
	}, []);
	/* ---------------------------------------------------------------------- */
	/* Program identity                                                       */
	/* ---------------------------------------------------------------------- */

	const setProgramIdentity = useCallback((identity: ProgramIdentity) => {
		setProgramId(identity.programId);
		setRevisionId(identity.revisionId);

		if (identity.programIdentifier !== undefined) {
			setProgramIdentifier(identity.programIdentifier);
		}

		if (identity.programName !== undefined) {
			setProgramName(identity.programName);
		}

		if (identity.revisionLabel !== undefined) {
			setRevisionLabel(identity.revisionLabel);
		}
	}, []);

	/* ---------------------------------------------------------------------- */
	/* Navigation                                                             */
	/* ---------------------------------------------------------------------- */

	const setActiveSection = useCallback(
		(sectionId: string) => {
			const exists = sections.some((section) => section.id === sectionId);
			if (!exists) return;
			setActiveSectionState(sectionId);
		},
		[sections],
	);

	/* ---------------------------------------------------------------------- */
	/* Save handler registration                                              */
	/* ---------------------------------------------------------------------- */

	const registerSaveHandler = useCallback(
		(handler: (() => Promise<void>) | null) => {
			saveHandlerRef.current = handler;
		},
		[],
	);

	/* ---------------------------------------------------------------------- */
	/* Save current section                                                   */
	/* ---------------------------------------------------------------------- */

	const saveCurrentSection = useCallback(async () => {
		const handler = saveHandlerRef.current;

		if (!handler || isSaving) {
			return;
		}

		try {
			setIsSaving(true);

			await handler();
		} finally {
			setIsSaving(false);
		}
	}, [isSaving]);

	/* ---------------------------------------------------------------------- */
	/* Section status                                                         */
	/* ---------------------------------------------------------------------- */

	const updateSectionStatus = useCallback(
		(sectionId: string, status: ProgramSectionStatus) => {
			setSections((current) =>
				current.map((section) =>
					section.id === sectionId
						? {
								...section,
								status,
							}
						: section,
				),
			);
		},
		[],
	);

	/* ---------------------------------------------------------------------- */
	/* Completion                                                             */
	/* ---------------------------------------------------------------------- */

	const completion = useMemo(() => calculateCompletion(sections), [sections]);

	/* ---------------------------------------------------------------------- */
	/* Workflow flags                                                         */
	/* ---------------------------------------------------------------------- */

	const isSubmitted =
		programStatus === "SUBMITTED" ||
		programStatus === "APPROVED" ||
		programStatus === "ACTIVE" ||
		programStatus === "EXPIRED";

	const approved =
		programStatus === "APPROVED" ||
		programStatus === "ACTIVE" ||
		programStatus === "EXPIRED";

	// Raad only
	const isReadOnly =
		mode === "edit" && programStatus !== undefined && programStatus !== "DRAFT";

	// Context value
	const value = useMemo<ProgramEditorContextValue>(
		() => ({
			/* Identity */
			mode,

			programId,
			revisionId,

			programIdentifier,
			programName,
			revisionLabel,

			setProgramIdentity,

			/* Workflow */
			programStatus,
			isSubmitted,
			approved,

			/* Sections */
			sections,
			completion,

			activeSection,
			setActiveSection,
			updateSectionStatus,

			/* Saving */
			isSaving,
			saveCurrentSection,
			registerSaveHandler,
			setSectionSaving,

			/* Permissions */
			isReadOnly,
		}),
		[
			mode,
			programId,
			revisionId,
			programIdentifier,
			programName,
			revisionLabel,
			setProgramIdentity,
			programStatus,
			isSubmitted,
			approved,
			sections,
			completion,
			activeSection,
			setActiveSection,
			updateSectionStatus,
			saveCurrentSection,
			registerSaveHandler,
			setSectionSaving,
			isSaving,
			isReadOnly,
		],
	);

	return (
		<ProgramEditorContext.Provider value={value}>
			{children}
		</ProgramEditorContext.Provider>
	);
}

/* -------------------------------------------------------------------------- */
/* Hooks                                                                      */
/* -------------------------------------------------------------------------- */

export function useProgramEditor() {
	const context = useContext(ProgramEditorContext);

	if (!context) {
		throw new Error(
			"useProgramEditor must be used inside ProgramEditorProvider",
		);
	}

	return context;
}

export function useProgramEditorSections() {
	const { sections, completion, updateSectionStatus } = useProgramEditor();

	return {
		sections,
		completion,
		updateSectionStatus,
	};
}
