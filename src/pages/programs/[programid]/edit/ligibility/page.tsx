import { EligibilityForm } from "@/features/program";
import { useProgramEditor } from "@/features/program/editor/program-editor-context";

export default function EligibilityPage() {
	const { mode, programId } = useProgramEditor();

	console.log("PROGRAM EDITOR", {
		mode,
		programId,
	});
	return <EligibilityForm />;
}
