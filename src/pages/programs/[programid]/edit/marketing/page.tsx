import { MarketingForm } from "@/features/program";
import { useProgramEditor } from "@/features/program/editor/program-editor-context";

export default function MarketingPage() {
	const { mode, programId } = useProgramEditor();

	console.log("PROGRAM EDITOR", { mode, programId });

	return <MarketingForm />;
}
