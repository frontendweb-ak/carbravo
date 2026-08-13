import { Card, CardContent, CardHeader, Skeleton } from "@/components/ui";

function RecentActivitySkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-5 w-32" />
			</CardHeader>

			<CardContent className="space-y-4">
				{Array.from({ length: 4 }).map((_, index) => (
					<div key={JSON.stringify(index)} className="flex items-start gap-3">
						{/* Activity indicator */}
						<Skeleton className="mt-1.5 size-2 shrink-0 rounded-full" />

						<div className="min-w-0 flex-1 space-y-1">
							{/* Activity text */}
							<Skeleton className="h-4 w-full max-w-[230px]" />

							{/* Time */}
							<Skeleton className="h-3 w-20" />
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}

export { RecentActivitySkeleton };
