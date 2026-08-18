import { Box, Container, Paper, Typography } from "@mui/material";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

import type { ProgramWorkflowStatus } from "@/config/constants";

import {
	ProgramSectionSidebar,
	useProgram,
	useProgramRevisionHistory,
} from "@/features/program";

import { PROGRAM_SIDE_MENU } from "@/features/program/constants";

import {
	type ProgramEditorMode,
	ProgramEditorProvider,
	useProgramEditor,
} from "@/features/program/editor/program-editor-context";

import type { ProgramRevisionHistoryState } from "@/features/program/model/revisions.types";

import {
	getCurrentRevision,
	getProgramRevisionSelection,
	getProgramRevisionTabs,
	getSelectedRevision,
	type ProgramRevisionView,
} from "@/features/program/utils";

import { ProgramRevisionHistory } from "@/features/program/components";
import { PageState } from "../ui";
import {
	ProgramContextHeader,
	type ProgramRevisionTab,
} from "./program-context-header";

interface ProgramLayoutProps {
	mode?: ProgramEditorMode;
}

interface ProgramLayoutContentProps {
	revisionTabs: ProgramRevisionTab[];
	revisionHistory?: ProgramRevisionHistoryState;
	currentRevisionId?: number;
}

function ProgramLayoutContent({
	revisionTabs,
	revisionHistory,
	currentRevisionId,
}: ProgramLayoutContentProps) {
	const navigate = useNavigate();
	const location = useLocation();

	const revisionSelection = getProgramRevisionSelection(location.search);

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
	 * The URL determines which section is displayed.
	 */
	const activeSection =
		PROGRAM_SIDE_MENU.find((section) =>
			location.pathname.endsWith(`/${section.id}`),
		)?.id ?? "setup";

	/*
	 * Runtime sidebar state.
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

	/*
	 * History list:
	 *
	 * ?view=history
	 */
	const isHistoryList =
		revisionSelection.view === "history" &&
		revisionSelection.revisionId == null;

	/*
	 * Current / active / historical revision editor.
	 */
	const isRevisionEditor = !isHistoryList;

	const revisionReadOnly = isReadOnly || revisionSelection.view !== "current";

	const handleSectionChange = (sectionId: string) => {
		if (mode === "new") {
			navigate(`/programs/new/${sectionId}`);
			return;
		}

		if (!programId) {
			return;
		}

		const params = new URLSearchParams(location.search);

		navigate({
			pathname: `/programs/${programId}/${sectionId}`,
			search: params.toString() ? `?${params.toString()}` : "",
		});
	};

	const handleRevisionChange = (view: ProgramRevisionView) => {
		if (mode !== "edit" || !programId) {
			return;
		}

		const params = new URLSearchParams(location.search);

		switch (view) {
			case "current":
				params.delete("view");
				params.delete("revision");
				break;

			case "active":
				params.set("view", "active");
				params.delete("revision");
				break;

			case "history":
				params.set("view", "history");
				params.delete("revision");
				break;
		}

		const search = params.toString();

		navigate({
			pathname: location.pathname,
			search: search ? `?${search}` : "",
		});
	};

	const handleViewRevision = (revisionId: number) => {
		const params = new URLSearchParams(location.search);

		params.set("view", "history");
		params.set("revision", String(revisionId));

		navigate({
			pathname: location.pathname,
			search: `?${params.toString()}`,
		});
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

	const headerName = programName || "Untitled program";
	const headerNumber = programIdentifier || "—";
	const headerRevision = revisionLabel || "1.0";

	return (
		<Box
			sx={{
				minHeight: "100vh",
				backgroundColor: "background.default",
				color: "text.primary",
			}}
		>
			{/* ---------------------------------------------------------- */}
			{/* Program context header                                     */}
			{/* ---------------------------------------------------------- */}

			<Box
				sx={{
					position: "sticky",
					top: 64,
					zIndex: 30,
					backgroundColor: "background.default",
				}}
			>
				<ProgramContextHeader
					name={headerName}
					type="INC"
					number={headerNumber}
					revision={headerRevision}
					status={headerStatus.toUpperCase() as ProgramWorkflowStatus}
					revisionTabs={revisionTabs.map((tab) => ({
						...tab,
						active: tab.id === revisionSelection.view,
					}))}
					onRevisionChange={handleRevisionChange}
					saved={!isSaving}
					saveLabel={isSaving ? "Saving..." : "Save draft"}
					saveDisabled={revisionReadOnly || isSaving}
					hideSave={revisionReadOnly}
					onSave={handleSave}
				/>
			</Box>

			{/* ---------------------------------------------------------- */}
			{/* Content                                                     */}
			{/* ---------------------------------------------------------- */}

			<Container
				maxWidth={false}
				disableGutters
				sx={{
					width: "100%",
					maxWidth: 1360,
					mx: "auto",
					mt: 4,
					px: { xs: 2, sm: 3, lg: 4 },
				}}
			>
				{isHistoryList ? (
					/*
					 * ---------------------------------------------------
					 * History list
					 * ---------------------------------------------------
					 */
					<Box component="main" sx={{ minWidth: 0 }}>
						{revisionHistory ? (
							<ProgramRevisionHistory
								history={revisionHistory}
								currentRevisionId={currentRevisionId ?? null}
								onViewRevision={handleViewRevision}
							/>
						) : (
							<Paper
								variant="outlined"
								sx={{
									p: 3,
									borderRadius: 3,
									backgroundColor: "background.paper",
								}}
							>
								<Typography variant="body2" color="text.secondary">
									Loading revision history...
								</Typography>
							</Paper>
						)}
					</Box>
				) : (
					/*
					 * ---------------------------------------------------
					 * Current / Active / Historical revision
					 * ---------------------------------------------------
					 */
					isRevisionEditor && (
						<Box
							sx={{
								display: "grid",
								minWidth: 0,
								gridTemplateColumns: {
									xs: "minmax(0, 1fr)",
									lg: "245px minmax(0, 1fr)",
								},
								alignItems: "start",
								gap: 5,
							}}
						>
							<Box
								component="aside"
								sx={{
									position: "sticky",
									top: 130,
									display: { xs: "none", lg: "block" },
								}}
							>
								<ProgramSectionSidebar
									sections={sidebarSections}
									activeSection={activeSection}
									onSectionChange={handleSectionChange}
									completion={completion}
									disabled={false}
								/>
							</Box>

							<Box component="main" sx={{ minWidth: 0 }}>
								<Outlet />
							</Box>
						</Box>
					)
				)}
			</Container>
		</Box>
	);
}

function ProgramLayout({ mode = "edit" }: ProgramLayoutProps) {
	const { programId } = useParams<{ programId: string }>();

	const location = useLocation();

	/*
	 * Route params are strings.
	 */
	const numericProgramId = programId ? Number(programId) : undefined;

	/*
	 * Existing program detail.
	 */
	const programQuery = useProgram(
		mode === "edit" ? numericProgramId : undefined,
	);

	/*
	 * Revision history.
	 */
	const revisionHistoryQuery = useProgramRevisionHistory(
		mode === "edit" ? numericProgramId : undefined,
	);

	/*
	 * Existing program must be resolved before
	 * initializing the editor provider.
	 */
	if (mode === "edit") {
		if (programQuery.isLoading) {
			return <PageState status="loading" loadingMessage="Loading program..." />;
		}

		if (programQuery.isError) {
			return (
				<PageState
					status="error"
					errorTitle="Failed to load program"
					errorDescription="We couldn't load this program. Please try again."
					onRetry={programQuery.refetch}
				/>
			);
		}

		if (!programQuery.data) {
			return (
				<PageState
					status="empty"
					emptyTitle="Program not found"
					emptyDescription="The requested program could not be found."
				/>
			);
		}
	}

	const program = programQuery.data;
	const revisionHistory = revisionHistoryQuery.data;

	/*
	 * Determine which revision view the URL requests.
	 */
	const revisionSelection = getProgramRevisionSelection(location.search);

	/*
	 * Current revision.
	 */
	const currentRevision =
		mode === "edit" && program ? getCurrentRevision(program) : null;

	/*
	 * Build tabs from API data.
	 */
	const revisionTabs =
		mode === "edit" && program && revisionHistory
			? getProgramRevisionTabs(program, revisionHistory)
			: [];

	/*
	 * Resolve actual revision.
	 */
	const selectedRevision =
		mode === "edit" && program && revisionHistory
			? getSelectedRevision(program, revisionHistory, revisionSelection)
			: null;

	const revisionId = selectedRevision?.id ?? undefined;

	return (
		<ProgramEditorProvider
			mode={mode}
			programId={mode === "edit" ? program?.id : undefined}
			revisionId={revisionId}
			programIdentifier={mode === "edit" ? program?.identifier : undefined}
			programName={mode === "edit" ? program?.name : undefined}
			revisionLabel={
				mode === "edit" ? (selectedRevision?.label ?? undefined) : undefined
			}
			programStatus={
				mode === "edit" ? (selectedRevision?.status ?? undefined) : undefined
			}
		>
			<ProgramLayoutContent
				revisionTabs={revisionTabs}
				revisionHistory={revisionHistory}
				currentRevisionId={currentRevision?.id ?? undefined}
			/>
		</ProgramEditorProvider>
	);
}

export default ProgramLayout;
