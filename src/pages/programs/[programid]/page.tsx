// pages/programs/[programid]/edit/page.tsx

import { ProgramSectionSidebar } from "@/features/program";
import { PROGRAM_SIDE_MENU } from "@/features/program/constants";
import { useState } from "react";
import { Outlet } from "react-router-dom";

// 
export default function ProgramDetailPage() {
	const [activeSection, setActiveSection] = useState("");
	return (
		<div className="mx-auto w-full max-w-350 p-6">
			<div className="grid grid-cols-[240px_minmax(0,1fr)] gap-5">
				<ProgramSectionSidebar
					sections={PROGRAM_SIDE_MENU}
					activeSection={activeSection}
					onSectionChange={setActiveSection}
					completion={0}
				/>

				<section className="min-w-0">
					<Outlet />
				</section>
			</div>
		</div>
	);
}
