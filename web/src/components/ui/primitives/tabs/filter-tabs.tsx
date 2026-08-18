import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import type { ReactNode } from "react";

export interface FilterTab<T extends string = string> {
	value: T;
	label: ReactNode;
	count?: number;
	disabled?: boolean;
}

export interface FilterTabsProps<T extends string = string> {
	items: FilterTab<T>[];
	value: T;
	onValueChange: (value: T) => void;
}

function FilterTabs<T extends string>({
	items,
	value,
	onValueChange,
}: FilterTabsProps<T>) {
	return (
		<Tabs
			value={value}
			onChange={(_, newValue) => {
				onValueChange(newValue as T);
			}}
			variant="scrollable"
			scrollButtons={false}
			sx={{
				minHeight: 32,

				"& .MuiTabs-flexContainer": {
					gap: 0.75,
				},

				"& .MuiTabs-indicator": {
					display: "none",
				},

				"& .MuiTab-root": {
					minWidth: "unset",
					minHeight: 32,
					height: 32,

					px: 1.75,
					py: 0,

					borderRadius: "16px",

					fontSize: 12,
					fontWeight: 600,
					textTransform: "none",

					backgroundColor: "background.paper",
					color: "text.secondary",

					border: "1px solid",
					borderColor: "divider",

					boxShadow: "0 1px 2px rgba(0,0,0,0.02)",

					opacity: 1,

					"&.Mui-selected": {
						backgroundColor: "brandTeal.main",
						color: "#fff",
						borderColor: "transparent",
						fontWeight: 700,
						boxShadow: "none",
					},

					"&:hover": {
						backgroundColor: "action.hover",
					},

					"&.Mui-selected:hover": {
						backgroundColor: "brandTeal.main",
					},

					"&.Mui-disabled": {
						opacity: 0.45,
					},
				},
			}}
		>
			{items.map((item) => (
				<Tab
					key={item.value}
					value={item.value}
					disabled={item.disabled}
					disableRipple
					label={
						<Box
							component="span"
							sx={{
								display: "inline-flex",
								alignItems: "center",
								gap: "6px",
								whiteSpace: "nowrap",
							}}
						>
							<Box
								component="span"
								sx={{
									display: "inline-flex",
									alignItems: "center",
								}}
							>
								{item.label}
							</Box>

							{item.count !== undefined && (
								<Box
									component="span"
									sx={{
										fontSize: 11,
										fontWeight: 500,
										lineHeight: 1,
										color: "inherit",
										opacity: 0.7,
									}}
								>
									{item.count}
								</Box>
							)}
						</Box>
					}
				/>
			))}
		</Tabs>
	);
}

export { FilterTabs };

