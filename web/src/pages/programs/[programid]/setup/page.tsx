import { SetupForm } from "@/features/program";
import { useProgramEditor } from "@/features/program/editor/program-editor-context";
import { useNavigate } from "react-router-dom";

export default function SetupPage() {
	const navigate = useNavigate();

	const { mode, programId, revisionId, isReadOnly } = useProgramEditor();

	return (
		<SetupForm
			mode={mode}
			programId={programId}
			revisionId={revisionId}
			readOnly={isReadOnly}
			onCreated={({ programId }) => {
				navigate(`/programs/${programId}/setup`, { replace: true });
			}}
		/>
	);
}