import { Button, Container, Separator } from "@/components/ui";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface ProgramRevisionTab {
	id: "current" | "active" | "history";
	label: string;
	subtitle: string;
	active?: boolean;
}

export interface ProgramContextHeaderProps {
	name?: ReactNode;
	type?: ReactNode;
	number?: ReactNode;
	revision?: ReactNode;
	status?: ReactNode;
	saved?: boolean;
	saveLabel?: ReactNode;
	onSave?: () => void;
	backHref?: string;
	backLabel?: ReactNode;
	hideSave?: boolean;
	saveDisabled?: boolean;
	className?: string;
	/**
	 * Revision navigation tabs.
	 *
	 * The parent determines which tabs exist based on the
	 * actual revision history returned by the API.
	 */
	revisionTabs?: ProgramRevisionTab[];
	/**
	 * Called when the user changes the revision view.
	 */
	onRevisionChange?: (revisionId: ProgramRevisionTab["id"]) => void;
}

function ProgramContextHeader({
	name = "Untitled program",
	type = "INC",
	number = "—",
	revision = "1.0",
	status = "Draft",
	saved = true,
	saveLabel = "Save draft",
	onSave,
	backHref = "/programs",
	backLabel = "← Programs",

	hideSave = false,
	saveDisabled = false,

	revisionTabs = [],
	onRevisionChange,

	className,
}: ProgramContextHeaderProps) {
	return (
		<div className={className}>
			<Container
				size="2xl"
				className="flex min-h-19 items-center justify-between gap-4"
			>
				{/* Left */}
				<div className="flex min-w-0 items-center gap-3">
					<Link
						to={backHref}
						className="shrink-0 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
					>
						{backLabel}
					</Link>

					<div className="h-6 w-px bg-border" />
					<h1 className="truncate text-xl font-bold text-foreground">{name}</h1>
					<span className="shrink-0 text-xs text-muted-foreground">{type}</span>
					<span className="shrink-0 text-xs text-muted-foreground">·</span>
					<span className="shrink-0 text-xs text-muted-foreground">
						{number}
					</span>

					<span className="shrink-0 rounded-md bg-muted px-3 py-1 text-xs font-semibold text-foreground">
						Rev: {revision}
					</span>

					<span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
						{status}
					</span>
				</div>

				{/* Right */}
				<div className="flex shrink-0 items-center gap-4">
					{saved && (
						<div className="flex items-center gap-1.5 text-sm font-semibold text-success">
							<Check className="size-4" />
							<span>All changes saved</span>
						</div>
					)}

					{!hideSave && (
						<Button
							type="button"
							variant="outline"
							disabled={saveDisabled}
							onClick={onSave}
						>
							{saveLabel}
						</Button>
					)}
				</div>
			</Container>
			{revisionTabs.length > 0 && (
				<Container size="2xl" className="pb-3">
					<div
						className="flex items-center gap-2"
						role="tablist"
						aria-label="Program revisions"
					>
						{revisionTabs.map((tab) => (
							<button
								key={tab.id}
								type="button"
								role="tab"
								aria-selected={tab.active ?? false}
								onClick={() => onRevisionChange?.(tab.id)}
								className={[
									"inline-flex items-center gap-2 rounded-full border px-4 py-2",
									"text-xs font-bold transition-colors",
									tab.active
										? "border-foreground bg-foreground text-background"
										: "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
								].join(" ")}
							>
								<span>{tab.label}</span>
								<span
									className={
										tab.active ? "text-background/70" : "text-muted-foreground"
									}
								>
									{tab.subtitle}
								</span>
							</button>
						))}
					</div>
				</Container>
			)}
			<Container>
				<Separator orientation="horizontal" />
			</Container>
		</div>
	);
}

export { ProgramContextHeader };

