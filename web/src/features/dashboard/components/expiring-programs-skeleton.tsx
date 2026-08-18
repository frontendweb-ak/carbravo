import { Card } from "@/components/ui";
import Box from "@mui/material/Box";

import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";

function ExpiringProgramsSkeleton() {
	return (
		<Card>
			<CardContent sx={{ p: 3 }}>
				<Box sx={{ mb: 3 }}>
					<Skeleton variant="text" width={220} height={32} />
					<Skeleton variant="text" width={320} height={24} sx={{ mt: 0.5 }} />
				</Box>

				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					{Array.from({ length: 3 }).map((_, index) => (
						<Box
							key={index}
							sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}
						>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
									gap: 2,
								}}
							>
								<Box
									sx={{
										flex: 1,
										display: "flex",
										flexDirection: "column",
										gap: 1,
									}}
								>
									<Skeleton variant="text" width={180} height={24} />
									<Skeleton variant="text" width={260} height={20} />
								</Box>
								<Skeleton variant="rounded" width={80} height={28} />
							</Box>

							<Box
								sx={{
									mt: 3,
									display: "grid",
									gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
									gap: 2,
								}}
							>
								<Box>
									<Skeleton variant="text" width={80} height={18} />

									<Skeleton variant="text" width={120} height={24} />
								</Box>

								<Box>
									<Skeleton variant="text" width={80} height={18} />

									<Skeleton variant="text" width={120} height={24} />
								</Box>
							</Box>
						</Box>
					))}
				</Box>
			</CardContent>
		</Card>
	);
}

export { ExpiringProgramsSkeleton };
