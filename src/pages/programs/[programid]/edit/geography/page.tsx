import { useProgramEditor } from "@/features/program/editor/program-editor-context";
import { GeographyForm } from "@/features/program/forms/geography-form";

export default function GeographyPage() {
	const { mode, programId } = useProgramEditor();

	console.log("PROGRAM EDITOR", {
		mode,
		programId,
	});

	return <GeographyForm />;
}
