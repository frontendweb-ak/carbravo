import type { ProgramRevisionHistoryState } from "@/features/program/model/revisions.types";

interface ProgramRevisionHistoryProps {
	history: ProgramRevisionHistoryState;
	currentRevisionId: number | null;
	onViewRevision?: (revisionId: number) => void;
}

export function ProgramRevisionHistory({
	history,
	currentRevisionId,
	onViewRevision,
}: ProgramRevisionHistoryProps) {
	const previousRevisions = history.revisions.filter(
		(revision) => revision.id !== currentRevisionId,
	);

	return (
		<section className="rounded-2xl border bg-card p-6">
			<div className="mb-5">
				<h2 className="text-base font-semibold text-foreground">
					Revision history
				</h2>

				<p className="mt-1 text-sm text-muted-foreground">
					Previously active revisions of this program. Open any revision to view
					its configuration read-only.
				</p>
			</div>

			{previousRevisions.length === 0 ? (
				<div className="rounded-xl border border-dashed p-8 text-center">
					<p className="text-sm text-muted-foreground">
						No previous revisions available.
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{previousRevisions.map((revision) => (
						<div
							key={revision.id}
							className="flex items-center justify-between gap-4 rounded-xl border p-4"
						>
							<div className="flex min-w-0 items-center gap-4">
								<span className="shrink-0 rounded-md bg-muted px-3 py-1 text-xs font-semibold">
									Rev {revision.label}
								</span>

								<span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold">
									{revision.status}
								</span>

								<div className="min-w-0 text-sm text-muted-foreground">
									{revision.postedAt
										? `Posted ${revision.postedAt}`
										: "Not posted"}
									{" · "}
									{revision.postedBy ?? revision.createdBy}
								</div>
							</div>

							<button
								type="button"
								className="shrink-0 rounded-md bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
								onClick={() => onViewRevision?.(revision.id)}
							>
								View read-only
							</button>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
