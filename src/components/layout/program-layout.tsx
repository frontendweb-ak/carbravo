import { ProgramSectionSidebar } from "@/features/program";
import { PROGRAM_SIDE_MENU } from "@/features/program/constants";
import {
	type ProgramEditorMode,
	ProgramEditorProvider,
} from "@/features/program/editor/program-editor-context";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { ProgramContextHeader } from "./program-context-header";

interface ProgramLayoutProps {
	mode?: ProgramEditorMode;
}

function ProgramLayout({ mode = "edit" }: ProgramLayoutProps) {
	const navigate = useNavigate();
	const location = useLocation();

	const { programId } = useParams<{ programId: string }>();

	const activeSection =
		PROGRAM_SIDE_MENU.find((section) =>
			location.pathname.endsWith(`/${section.id}`),
		)?.id ?? "setup";

	const handleSectionChange = (sectionId: string) => {
		if (mode === "new") {
			navigate(`/programs/new/${sectionId}`);
			return;
		}

		if (!programId) {
			return;
		}

		navigate(`/programs/${programId}/edit/${sectionId}`);
	};

	return (
		<ProgramEditorProvider mode={mode} programId={programId}>
			<div className="min-h-screen bg-background">
				<div className="sticky top-[65px] z-30 bg-background border-b">
					<ProgramContextHeader
						name="Untitled program"
						type="INC"
						number="—"
						revision="1.0"
						status="Draft"
						saved
						onSave={() => {
							console.log("Save draft");
						}}
					/>
				</div>

				<div className="mx-auto w-full max-w-7xl py-4">
					<div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[245px_minmax(0,1fr)]">
						<div className="sticky hidden lg:block top-[160px]">
							<ProgramSectionSidebar
								sections={PROGRAM_SIDE_MENU}
								activeSection={activeSection}
								onSectionChange={handleSectionChange}
								completion={0}
							/>
						</div>
						<main className="min-w-0">
							<Outlet />
						</main>
					</div>
				</div>
			</div>
		</ProgramEditorProvider>
	);
}

export default ProgramLayout;