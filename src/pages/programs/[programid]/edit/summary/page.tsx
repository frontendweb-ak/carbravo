import { SummaryForm } from "@/features/program";
import { useProgramEditor } from "@/features/program/editor/program-editor-context";

export default function SummaryPage() {
	const { mode, programId } = useProgramEditor();
	console.log("PROGRAM EDITOR", { mode, programId });
	return <SummaryForm />;
}
