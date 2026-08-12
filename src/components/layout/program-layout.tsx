import { ProgramSectionSidebar } from "@/features/program";
import { PROGRAM_SIDE_MENU } from "@/features/program/constants";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ProgramContextHeader } from "./program-context-header";

interface ProgramLayoutProps {
	mode?: "new" | "edit";
}

function ProgramLayout({ mode = "edit" }: ProgramLayoutProps) {
	const navigate = useNavigate();
	const location = useLocation();

	const activeSection =
		PROGRAM_SIDE_MENU.find((section) =>
			location.pathname.endsWith(`/${section.id}`),
		)?.id ?? "setup";

	const handleSectionChange = (sectionId: string) => {
		if (mode === "new") {
			navigate(`/programs/new/${sectionId}`);
			return;
		}

		const match = location.pathname.match(/^\/programs\/([^/]+)\/edit/);

		if (!match) {
			return;
		}

		navigate(`/programs/${match[1]}/edit/${sectionId}`);
	};

	return (
		<div className="min-h-[calc(100vh-60px)] bg-background">
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

			<div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
				<div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[245px_minmax(0,1fr)]">
					<ProgramSectionSidebar
						sections={PROGRAM_SIDE_MENU}
						activeSection={activeSection}
						onSectionChange={handleSectionChange}
						completion={0}
					/>

					<main className="min-w-0">
						<Outlet />
					</main>
				</div>
			</div>
		</div>
	);
}

export default ProgramLayout;
