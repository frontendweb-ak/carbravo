import { Skeleton } from "@/components/ui";

function RecentActivitySkeleton() {
	return (
		<div className="space-y-2">
			{Array.from({ length: 5 }).map((_, index) => (
				<div key={index} className="flex gap-3">
					<Skeleton className="mt-1.5 size-2 shrink-0 rounded-full" />

					<div className="min-w-0 flex-1">
						<div className="space-y-1">
							<Skeleton className="h-4 w-[85%]" />
							<Skeleton className="h-3 w-20" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export { RecentActivitySkeleton };
