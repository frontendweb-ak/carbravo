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
				height: 30,
				borderRadius: "15px",

				fontSize: 12,
				fontWeight: selected ? 700 : 600,
				lineHeight: 1,

				backgroundColor: selected ? "brandTeal.main" : "background.paper",

				color: selected ? "#FFFFFF" : "text.secondary",

				border: "1px solid",
				borderColor: selected ? "brandTeal.main" : "divider",

				boxShadow: "none",

				"& .MuiChip-label": {
					px: 1.5,
					display: "flex",
					alignItems: "center",
					gap: 0.5,
				},

				"&:hover": {
					backgroundColor: selected ? "brandTeal.main" : "action.hover",
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
