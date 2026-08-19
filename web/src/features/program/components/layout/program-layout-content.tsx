import { Box, Container, Paper, Typography } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import type { ProgramWorkflowStatus } from "@/config/constants";

import { ProgramSectionSidebar } from "@/features/program";

import { PROGRAM_SIDE_MENU } from "@/features/program/constants";

import { useProgramEditor } from "@/features/program/editor/program-editor-context";

import type { ProgramRevisionHistoryState } from "@/features/program/model/revisions.types";

import {
	getProgramRevisionSelection,
	type ProgramRevisionView,
} from "@/features/program/utils";

import { ProgramRevisionHistory } from "../revision";
import {
	ProgramContextHeader,
	type ProgramRevisionTab,
} from "./program-context-header";

interface ProgramLayoutContentProps {
	revisionTabs: ProgramRevisionTab[];
	revisionHistory?: ProgramRevisionHistoryState;
	currentRevisionId?: number;
}

export function ProgramLayoutContent({
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
		if (!programId) {
			// A new program must be created from Setup first.
			if (sectionId !== "setup") {
				return;
			}

			navigate("/programs/new/setup");
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
