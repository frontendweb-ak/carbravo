import { VehiclesForm } from "@/features/program";
import { useProgramEditor } from "@/features/program/editor/program-editor-context";

export default function VehiclesPage() {
	const { mode, programId } = useProgramEditor();

	console.log("PROGRAM EDITOR", {
		mode,
		programId,
	});

	return <VehiclesForm />;
}
