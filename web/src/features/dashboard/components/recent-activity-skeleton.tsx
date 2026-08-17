import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

function RecentActivitySkeleton() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 1,
			}}
		>
			{Array.from({ length: 5 }).map((_, index) => (
				<Box
					key={index}
					sx={{
						display: "flex",
						gap: 1.5,
					}}
				>
					<Skeleton
						variant="circular"
						width={8}
						height={8}
						sx={{
							mt: 1.5,
							flexShrink: 0,
						}}
					/>

					<Box
						sx={{
							minWidth: 0,
							flex: 1,
						}}
					>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: 0.5,
							}}
						>
							<Skeleton variant="rounded" width="85%" height={16} />

							<Skeleton variant="rounded" width={80} height={12} />
						</Box>
					</Box>
				</Box>
			))}
		</Box>
	);
}

export { RecentActivitySkeleton };
