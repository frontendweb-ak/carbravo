// src/components/ui/filter-tabs.tsx

import Badge from "@mui/material/Badge";
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
			onChange={(_, newValue) => onValueChange(newValue)}
			variant="scrollable"
			scrollButtons="auto"
		>
			{items.map((item) => (
				<Tab
					key={item.value}
					value={item.value}
					disabled={item.disabled}
					label={
						item.count !== undefined ? (
							<Badge badgeContent={item.count} color="primary" showZero>
								{item.label}
							</Badge>
						) : (
							item.label
						)
					}
				/>
			))}
		</Tabs>
	);
}

export { FilterTabs };
