import type { GeographyRule } from "../../schema";
import { ProgramSection } from "../program-section";

interface CoverageRulesProps {
	included: GeographyRule[];
	excluded: GeographyRule[];

	onRemoveInclude?: (index: number) => void;
	onRemoveExclude?: (index: number) => void;
}

export function CoverageRules({
	included,
	excluded,
	onRemoveInclude,
	onRemoveExclude,
}: CoverageRulesProps) {
	return (
		<ProgramSection title="Coverage rules" description={undefined}>
			<div className="grid gap-6 md:grid-cols-2">
				<CoverageColumn
					title="Included"
					rules={included}
					emptyMessage="At least one include rule is required."
					variant="include"
					onRemove={onRemoveInclude}
				/>

				<CoverageColumn
					title="Excluded"
					rules={excluded}
					emptyMessage="No exclusions."
					variant="exclude"
					onRemove={onRemoveExclude}
				/>
			</div>
		</ProgramSection>
	);
}

interface CoverageColumnProps {
	title: string;
	rules: GeographyRule[];
	emptyMessage: string;
	variant: "include" | "exclude";
	onRemove?: (index: number) => void;
}

function CoverageColumn({
	title,
	rules,
	emptyMessage,
	variant,
	onRemove,
}: CoverageColumnProps) {
	return (
		<div>
			<div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
				{title}
			</div>

			{rules.length === 0 ? (
				<p
					className={
						variant === "include"
							? "text-sm text-warning"
							: "text-sm text-muted-foreground"
					}
				>
					{emptyMessage}
				</p>
			) : (
				<div className="space-y-2">
					{rules.map((rule, index) => (
						<div
							key={rule.id}
							className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
						>
							<div className="min-w-0">
								<div className="text-sm font-semibold text-foreground">
									{rule.value}
								</div>

								<div className="text-xs text-muted-foreground">
									{rule.level}
								</div>
							</div>

							{onRemove && (
								<button
									type="button"
									onClick={() => onRemove(index)}
									className="shrink-0 rounded-md p-1.5 text-destructive hover:bg-destructive/10"
									aria-label={`Remove ${title.toLowerCase()} rule`}
								>
									×
								</button>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
