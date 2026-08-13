import { createContext, type ReactNode, useContext } from "react";

export type ProgramEditorMode = "new" | "edit";

export interface ProgramEditorContextValue {
	mode: ProgramEditorMode;
	programId?: string;
}

const ProgramEditorContext = createContext<ProgramEditorContextValue | null>(
	null,
);

interface ProgramEditorProviderProps {
	children: ReactNode;
	mode: ProgramEditorMode;
	programId?: string;
}

export function ProgramEditorProvider({
	children,
	mode,
	programId,
}: ProgramEditorProviderProps) {
	return (
		<ProgramEditorContext.Provider value={{ mode, programId }}>
			{children}
		</ProgramEditorContext.Provider>
	);
}

export function useProgramEditor() {
	const context = useContext(ProgramEditorContext);

	if (!context) {
		throw new Error(
			"useProgramEditor must be used inside ProgramEditorProvider",
		);
	}

	return context;
}
