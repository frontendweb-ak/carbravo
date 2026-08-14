import { SetupForm } from "@/features/program";
import { useProgramEditor } from "@/features/program/editor/program-editor-context";

export default function SetupPage() {
	const { mode, programId, revisionId, isReadOnly } = useProgramEditor();

	return (
		<SetupForm
			mode={mode}
			programId={programId}
			revisionId={revisionId}
			readOnly={isReadOnly}
		/>
	);
}
