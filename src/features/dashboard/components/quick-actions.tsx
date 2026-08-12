import { Button } from "@/components/ui";
import { ClipboardCheck, Plus, Search } from "lucide-react";

export interface QuickActionsProps {
	onNewProgram?: () => void;
	onBrowsePrograms?: () => void;
	onReviewQueue?: () => void;
	reviewCount?: number;
}

function QuickActions({
	onNewProgram,
	onBrowsePrograms,
	onReviewQueue,
	reviewCount = 0,
}: QuickActionsProps) {
	return (
		<section className="rounded-2xl bg-brand-teal p-5 text-white">
			<h2 className="text-base font-bold">Quick actions</h2>

			<p className="mt-0.5 text-sm text-white/70">
				Start or manage incentive programs
			</p>

			<div className="mt-4 space-y-2">
				<Button
					type="button"
					className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
					onClick={onNewProgram}
				>
					<Plus className="size-4" />
					New program
				</Button>

				<Button
					type="button"
					variant="outline"
					className="w-full justify-start gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
					onClick={onBrowsePrograms}
				>
					<Search className="size-4" />
					Browse all programs
				</Button>

				<Button
					type="button"
					variant="outline"
					className="w-full justify-between border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
					onClick={onReviewQueue}
				>
					<span className="flex items-center gap-2">
						<ClipboardCheck className="size-4" />
						Review queue
					</span>

					{reviewCount > 0 && (
						<span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
							{reviewCount}
						</span>
					)}
				</Button>
			</div>
		</section>
	);
}

export { QuickActions };
