import { PROGRAM_MESSAGES } from "@/features/program/constants/messages";

export function ProgramNoDraft() {
	const message = PROGRAM_MESSAGES.noDraftRevision;

	return (
		<div className="flex min-h-[50vh] items-center justify-center">
			<div className="text-center">
				<h2 className="text-lg font-semibold text-foreground">
					{message.title}
				</h2>

				<p className="mt-1 text-sm text-muted-foreground">
					{message.description}
				</p>
			</div>
		</div>
	);
}
