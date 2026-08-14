import { IncentiveValuesForm } from "@/features/program";
import { useProgramEditor } from "@/features/program/editor/program-editor-context";

export default function IncentiveValuesPage() {
	const { mode, programId } = useProgramEditor();

	console.log("PROGRAM EDITOR", {
		mode,
		programId,
	});

	return <IncentiveValuesForm />;
}
