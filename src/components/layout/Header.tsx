import { Plus } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { Button, Container } from "@/components/ui";

import { Logo } from "./logo";

function Header() {
	const navigate = useNavigate();

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-card">
			<Container className="flex h-15 items-center justify-between px-8">
				{/* Left */}
				<div className="flex h-full items-center">
					<NavLink
						to="/dashboard"
						className="flex items-center"
						aria-label="CarBravo"
					>
						<Logo size={32} className="h-8 w-auto" />
					</NavLink>

					{/* Navigation */}
					<nav className="ml-8 flex items-center gap-2">
						<NavLink
							to="/dashboard"
							className={({ isActive }) =>
								[
									"rounded-lg px-4 py-2",
									"text-sm font-semibold",
									"transition-colors",
									isActive
										? "bg-muted text-foreground"
										: "text-foreground hover:bg-muted",
								].join(" ")
							}
						>
							Dashboard
						</NavLink>

						<NavLink
							to="/programs"
							className={({ isActive }) =>
								[
									"rounded-lg px-4 py-2",
									"text-sm font-semibold",
									"transition-colors",
									isActive
										? "bg-muted text-foreground"
										: "text-foreground hover:bg-muted",
								].join(" ")
							}
						>
							Programs
						</NavLink>
					</nav>
				</div>

				{/* Right */}
				<div className="flex items-center gap-4">
					<Button
						type="button"
						className="gap-2 rounded-xl px-5"
						onClick={() => navigate("/programs/new")}
					>
						<Plus className="h-4 w-4" />
						New Program
					</Button>

					<div className="h-8 w-px bg-border" />

					<div className="flex items-center gap-2">
						<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Role
						</span>

						<button
							type="button"
							className="flex h-9 min-w-22 items-center justify-between rounded-lg border border-input bg-background px-3 text-sm font-semibold"
						>
							<span>Admin</span>

							<span className="text-muted-foreground">▾</span>
						</button>
					</div>

					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
						AC
					</div>
				</div>
			</Container>
		</header>
	);
}

export default Header;
