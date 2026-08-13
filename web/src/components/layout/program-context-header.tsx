import { Button, Container, Separator } from "@/components/ui";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface ProgramContextHeaderProps {
	/**
	 * Program name displayed in the header.
	 */
	name?: ReactNode;

	/**
	 * Program type/code.
	 */
	type?: ReactNode;

	/**
	 * Program identifier/number.
	 */
	number?: ReactNode;

	/**
	 * Current revision.
	 */
	revision?: ReactNode;

	/**
	 * Current program status.
	 */
	status?: ReactNode;

	/**
	 * Whether changes have been saved.
	 */
	saved?: boolean;

	/**
	 * Save button label.
	 */
	saveLabel?: ReactNode;

	/**
	 * Called when save is clicked.
	 */
	onSave?: () => void;

	/**
	 * Back destination.
	 */
	backHref?: string;

	/**
	 * Back label.
	 */
	backLabel?: ReactNode;

	/**
	 * Hide the save button.
	 */
	hideSave?: boolean;

	/**
	 * Disable save button.
	 */
	saveDisabled?: boolean;

	className?: string;
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
			<Container>
				<Separator orientation="horizontal" />
			</Container>
		</div>
	);
}

export { ProgramContextHeader };
