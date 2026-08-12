import { Button } from "@/components/ui";
import { Car, Plus } from "lucide-react";

export default function Header() {
	return (
		<header className="border-b bg-white">
			<div className="mx-auto flex py-2 items-center justify-between px-8">
				{/* Left */}
				<div className="flex items-center gap-10">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
							<Car className="h-5 w-5 text-primary" />
						</div>

						<div className="flex items-center gap-4">
							<span className="text-2xl font-bold text-slate-900">
								CarBravo
							</span>

							<div className="h-5 w-px bg-border" />

							<span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
								Incentives
							</span>
						</div>
					</div>

					<nav className="flex items-center gap-2">
						<Button variant="secondary" className="font-medium">
							Dashboard
						</Button>

						<Button variant="ghost" className="font-medium">
							Programs
						</Button>
					</nav>
				</div>

				{/* Right */}
				<div className="flex items-center gap-6">
					<Button className="gap-2 rounded-xl px-5">
						<Plus className="h-4 w-4" />
						New Program
					</Button>

					<div className="h-8 w-px bg-border" />

					<div className="flex items-center gap-2">
						<span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
							Role
						</span>

						{/* <Select defaultValue="admin">
							<SelectTrigger className="w-32">
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="admin">Admin</SelectItem>
								<SelectItem value="manager">Manager</SelectItem>
								<SelectItem value="viewer">Viewer</SelectItem>
							</SelectContent>
						</Select> */}
					</div>

					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
						AC
					</div>
				</div>
			</div>
		</header>
	);
}
