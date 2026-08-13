import type { ReactNode } from "react";

interface ProgramSectionProps {
	title: ReactNode;
	description?: ReactNode;
	headerAction?: ReactNode;
	children: ReactNode;
	className?: string;
}

function ProgramSection({
	title,
	description,
	headerAction,
	children,
	className,
}: ProgramSectionProps) {
	return (
		<section
			className={["rounded-2xl border border-border bg-card p-6", className]
				.filter(Boolean)
				.join(" ")}
		>
			<div className="mb-6 flex items-start justify-between gap-4">
				<div>
					<h2 className="text-base font-bold text-foreground">{title}</h2>

					{description && (
						<p className="mt-0.5 text-sm text-muted-foreground">
							{description}
						</p>
					)}
				</div>

				{headerAction}
			</div>

			{children}
		</section>
	);
}

export { ProgramSection };

