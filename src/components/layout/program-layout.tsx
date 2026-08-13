import { ProgramSectionSidebar } from "@/features/program";
import { PROGRAM_SIDE_MENU } from "@/features/program/constants";
import {
	type ProgramEditorMode,
	ProgramEditorProvider,
	useProgramEditor,
} from "@/features/program/editor/program-editor-context";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

import { ProgramContextHeader } from "./program-context-header";

interface ProgramLayoutProps {
	mode?: ProgramEditorMode;
}

/**
 * Inner layout.
 *
 * This component must be inside ProgramEditorProvider because
 * the provider owns:
 *
 * - program identity
 * - current section
 * - section completion
 * - save handler
 * - saving state
 * - workflow status
 */
function ProgramLayoutContent() {
	const navigate = useNavigate();
	const location = useLocation();

	const {
		mode,
		programId,
		programIdentifier,
		programName,
		revisionLabel,
		programStatus,
		sections,
		completion,
		saveCurrentSection,
		isSaving,
		isReadOnly,
	} = useProgramEditor();

	/*
	 * The URL remains the source of truth for which editor page
	 * is currently displayed.
	 */
	const activeSection =
		PROGRAM_SIDE_MENU.find((section) =>
			location.pathname.endsWith(`/${section.id}`),
		)?.id ?? "setup";

	/*
	 * Convert the static sidebar definition into the runtime
	 * section state from ProgramEditorContext.
	 *
	 * This gives us:
	 *
	 * pending
	 * warning
	 * completed
	 */
	const sidebarSections = PROGRAM_SIDE_MENU.map((menuSection) => {
		const runtimeSection = sections.find(
			(section) => section.id === menuSection.id,
		);

		return {
			...menuSection,
			status: runtimeSection?.status ?? "pending",
			completed: runtimeSection?.status === "completed",
		};
	});

	const handleSectionChange = (sectionId: string) => {
		/*
		 * New program has no ID until the first successful save.
		 */
		if (mode === "new") {
			navigate(`/programs/new/${sectionId}`);
			return;
		}

		/*
		 * Existing program.
		 */
		if (!programId) {
			return;
		}

		navigate(`/programs/${programId}/edit/${sectionId}`);
	};

	const handleSave = async () => {
		try {
			await saveCurrentSection();
		} catch (error) {
			console.error("Failed to save program section:", error);
		}
	};

	const headerStatus = (() => {
		switch (programStatus) {
			case "SUBMITTED":
				return "Submitted";
			case "APPROVED":
				return "Approved";
			case "ACTIVE":
				return "Active";
			case "EXPIRED":
				return "Expired";
			case "DRAFT":
			default:
				return "Draft";
		}
	})();

	/*
	 * For a newly-created program we still don't have an ID.
	 * The header can therefore safely display the temporary values.
	 */
	const headerName = programName || "Untitled program";
	const headerNumber = programIdentifier || "—";
	const headerRevision = revisionLabel || "1.0";

	return (
		<div className="min-h-screen bg-background">
			{/* -------------------------------------------------------------- */}
			{/* Program context header                                         */}
			{/* -------------------------------------------------------------- */}

			<div className="sticky top-[65px] z-30 border-b bg-background">
				<ProgramContextHeader
					name={headerName}
					type="INC"
					number={headerNumber}
					revision={headerRevision}
					status={headerStatus}
					saved={!isSaving}
					saveLabel={isSaving ? "Saving..." : "Save draft"}
					saveDisabled={isReadOnly || isSaving}
					hideSave={isReadOnly}
					onSave={handleSave}
				/>
			</div>

			{/* -------------------------------------------------------------- */}
			{/* Editor                                                          */}
			{/* -------------------------------------------------------------- */}

			<div className="mx-auto w-full max-w-7xl py-4">
				<div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[245px_minmax(0,1fr)]">
					{/* ------------------------------------------------------ */}
					{/* Sidebar                                                 */}
					{/* ------------------------------------------------------ */}

					<div className="sticky top-[160px] hidden lg:block">
						<ProgramSectionSidebar
							sections={sidebarSections}
							activeSection={activeSection}
							onSectionChange={handleSectionChange}
							completion={completion}
							disabled={false}
						/>
					</div>

					{/* ------------------------------------------------------ */}
					{/* Current section                                         */}
					{/* ------------------------------------------------------ */}

					<main className="min-w-0">
						<Outlet />
					</main>
				</div>
			</div>
		</div>
	);
}

/**
 * Program editor layout.
 *
 * Used by BOTH:
 *
 * /programs/new/*
 *
 * /programs/:programId/edit/*
 *
 * For a new program:
 *
 *   programId === undefined
 *
 * After the first save:
 *
 *   programId === actual database ID
 */
function ProgramLayout({ mode = "edit" }: ProgramLayoutProps) {
	const { programId } = useParams<{
		programId: string;
	}>();

	/*
	 * React Router params are strings.
	 *
	 * Convert only when a real program ID exists.
	 */
	const numericProgramId = programId ? Number(programId) : undefined;

	return (
		<ProgramEditorProvider mode={mode} programId={numericProgramId}>
			<ProgramLayoutContent />
		</ProgramEditorProvider>
	);
}

export default ProgramLayout;
