import { Button, Container } from "@/components/ui";
import { ChevronDown, Plus } from "lucide-react";

import { Logo } from "./logo";

export default function Header() {
	return (
		<header className="border-b bg-red">
			<Container className="flex min-h-16 items-center justify-between px-8">
				{/* =========================================================
				 * Left / Navigation
				 * ========================================================= */}
				<div className="flex h-full items-center gap-6">
					{/* Logo */}
					<a href="/" aria-label="CarBravo home" className="shrink-0">
						<Logo size={32} />
					</a>

					{/* Navigation */}
					<nav
						aria-label="Main navigation"
						className="ml-4 flex h-full items-center gap-8"
					>
						<a
							href="/dashboard"
							className="
								flex h-full items-center
								text-sm font-semibold
								text-foreground/80
								transition-colors
								hover:text-foreground
							"
						>
							Dashboard
						</a>

						<a
							href="/programs"
							className="
								flex h-full items-center
								text-sm font-semibold
								text-foreground
								transition-colors
								hover:text-primary
							"
							aria-current="page"
						>
							Programs
						</a>
					</nav>
				</div>

				{/* =========================================================
				 * Right
				 * ========================================================= */}
				<div className="flex items-center gap-5">
					{/* New Program */}
					<Button className="gap-2 rounded-xl px-5">
						<Plus className="size-4" />
						New Program
					</Button>

					{/* Divider */}
					<div className="h-8 w-px bg-border" />

					{/* Role */}
					<div className="flex items-center gap-2">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Role
						</span>

						<button
							type="button"
							className="
								flex h-9 min-w-24 items-center
								justify-between gap-3
								rounded-lg
								border border-input
								bg-background
								px-3
								text-sm font-semibold
								text-foreground
								outline-none
								transition-colors
								hover:bg-accent
								focus-visible:border-ring
								focus-visible:ring-3
								focus-visible:ring-ring/30
							"
							aria-label="Current role"
						>
							<span>Admin</span>

							<ChevronDown className="size-4 text-muted-foreground" />
						</button>
					</div>

					{/* Avatar */}
					<button
						type="button"
						className="
							flex size-10 shrink-0
							items-center justify-center
							rounded-full
							bg-sky-100
							text-sm font-semibold
							text-sky-700
							outline-none
							transition-colors
							hover:bg-sky-200
							focus-visible:ring-3
							focus-visible:ring-ring/30
						"
						aria-label="Open account menu"
					>
						AC
					</button>
				</div>
			</Container>
		</header>
	);
}
