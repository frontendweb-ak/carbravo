import { Card, CardContent, CardHeader, Skeleton } from "@/components/ui";

function ExpiringProgramsSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-5 w-44" />
				<Skeleton className="mt-1 h-4 w-72" />
			</CardHeader>

			<CardContent className="space-y-4">
				{Array.from({ length: 3 }).map((_, index) => (
					<div
						key={JSON.stringify(index)}
						className="rounded-lg border border-border p-4"
					>
						<div className="flex items-start justify-between gap-4">
							<div className="min-w-0 flex-1 space-y-2">
								<Skeleton className="h-4 w-40" />
								<Skeleton className="h-3 w-56" />
							</div>

							<Skeleton className="h-6 w-20 rounded-full" />
						</div>

						<div className="mt-4 grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<Skeleton className="h-3 w-20" />
								<Skeleton className="h-4 w-28" />
							</div>

							<div className="space-y-1">
								<Skeleton className="h-3 w-20" />
								<Skeleton className="h-4 w-28" />
							</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}

export { ExpiringProgramsSkeleton };
