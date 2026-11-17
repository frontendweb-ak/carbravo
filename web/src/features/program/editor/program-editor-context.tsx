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
	| "REVIEW"
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

export interface ProgramEditorContextValue {
	mode: ProgramEditorMode;
	programId?: number;
	revisionId?: number;
	programIdentifier?: string;
	programName?: string;
	revisionLabel?: string;
	programStatus?: ProgramWorkflowStatus;
	isSubmitted: boolean;
	approved: boolean;
	summaryDraft: string;
	setSummaryDraft: (value: string) => void;
	eligibilityFootnotesDraft: string;
	setEligibilityFootnotesDraft: (value: string) => void;
	sections: ProgramEditorSection[];
	completion: number;
	updateSectionStatus: (
		sectionId: string,
		status: ProgramSectionStatus,
	) => void;
	saveCurrentSection: () => Promise<void>;
	registerSaveHandler: (handler: (() => Promise<void>) | null) => void;
	setSectionSaving: (saving: boolean) => void;
	isSaving: boolean;
	isReadOnly: boolean;
	isMinorRevision: boolean;
}

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
		requiredForSubmission: false,
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

function calculateCompletion(sections: ProgramEditorSection[]): number {
	const requiredSections = sections.filter(
		(section) => section.requiredForSubmission,
	);

	if (requiredSections.length === 0) return 0;

	const completedSections = requiredSections.filter(
		(section) => section.status === "completed",
	).length;

	return Math.round((completedSections / requiredSections.length) * 100);
}

const ProgramEditorContext = createContext<ProgramEditorContextValue | null>(
	null,
);

export interface ProgramEditorProviderProps {
	children: ReactNode;
	mode: ProgramEditorMode;
	programId?: number;
	revisionId?: number;
	programIdentifier?: string;
	programName?: string;
	revisionLabel?: string;
	/**
	 * Status of the selected revision, not necessarily the parent program.
	 * A draft revision of an active program remains editable.
	 */
	programStatus?: ProgramWorkflowStatus;
	isMinorRevision?: boolean;
	initialSections?: ProgramEditorSection[];
}

export function ProgramEditorProvider({
	children,
	mode,
	programId,
	revisionId,
	programIdentifier,
	programName,
	revisionLabel,
	programStatus,
	isMinorRevision = false,
	initialSections,
}: ProgramEditorProviderProps) {
	const [sections, setSections] = useState<ProgramEditorSection[]>(
		() => initialSections ?? createInitialSections(),
	);
	const [summaryDraft, setSummaryDraft] = useState("");
	const [eligibilityFootnotesDraft, setEligibilityFootnotesDraft] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const saveHandlerRef = useRef<(() => Promise<void>) | null>(null);

	const editorKey = `${programId ?? "new"}:${revisionId ?? "new"}`;
	const previousEditorKeyRef = useRef(editorKey);

	useEffect(() => {
		if (previousEditorKeyRef.current === editorKey) return;

		previousEditorKeyRef.current = editorKey;
		setSections(initialSections ?? createInitialSections());
		setSummaryDraft("");
		setEligibilityFootnotesDraft("");
	}, [editorKey, initialSections]);

	const setSectionSaving = useCallback((saving: boolean) => {
		setIsSaving(saving);
	}, []);

	const registerSaveHandler = useCallback(
		(handler: (() => Promise<void>) | null) => {
			saveHandlerRef.current = handler;
		},
		[],
	);

	const saveCurrentSection = useCallback(async () => {
		const handler = saveHandlerRef.current;
		if (!handler || isSaving) return;

		setIsSaving(true);
		try {
			await handler();
		} finally {
			setIsSaving(false);
		}
	}, [isSaving]);

	const updateSectionStatus = useCallback(
		(sectionId: string, status: ProgramSectionStatus) => {
			setSections((current) =>
				current.map((section) =>
					section.id === sectionId ? { ...section, status } : section,
				),
			);
		},
		[],
	);

	const completion = useMemo(() => calculateCompletion(sections), [sections]);
	const isSubmitted =
		programStatus === "REVIEW" ||
		programStatus === "APPROVED" ||
		programStatus === "ACTIVE" ||
		programStatus === "EXPIRED";
	const approved =
		programStatus === "APPROVED" ||
		programStatus === "ACTIVE" ||
		programStatus === "EXPIRED";
	const isReadOnly =
		mode === "edit" && programStatus !== undefined && programStatus !== "DRAFT";

	const value = useMemo<ProgramEditorContextValue>(
		() => ({
			mode,
			programId,
			revisionId,
			programIdentifier,
			programName,
			revisionLabel,
			programStatus,
			isSubmitted,
			approved,
			summaryDraft,
			setSummaryDraft,
			eligibilityFootnotesDraft,
			setEligibilityFootnotesDraft,
			sections,
			completion,
			updateSectionStatus,
			saveCurrentSection,
			registerSaveHandler,
			setSectionSaving,
			isSaving,
			isReadOnly,
			isMinorRevision,
		}),
		[
			mode,
			programId,
			revisionId,
			programIdentifier,
			programName,
			revisionLabel,
			programStatus,
			isSubmitted,
			approved,
			summaryDraft,
			eligibilityFootnotesDraft,
			sections,
			completion,
			updateSectionStatus,
			saveCurrentSection,
			registerSaveHandler,
			setSectionSaving,
			isSaving,
			isReadOnly,
			isMinorRevision,
		],
	);

	return (
		<ProgramEditorContext.Provider value={value}>
			{children}
		</ProgramEditorContext.Provider>
	);
}

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
