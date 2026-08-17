import {
	Box,
	Card,
	Checkbox,
	Divider,
	FormControlLabel,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { type OptionGroupAccessors, resolveOption } from "@/utils";

export interface FilterSelectCardProps<T> extends OptionGroupAccessors<T> {
	title: ReactNode;

	options: T[];

	value?: string[];
	onValueChange?: (value: string[]) => void;

	allowAny?: boolean;
	anyValue?: string;
	anyLabel?: ReactNode;

	selectAll?: boolean;

	searchable?: boolean;
	searchPlaceholder?: string;

	loading?: boolean;
	loadingMessage?: ReactNode;

	emptyMessage?: ReactNode;

	disabled?: boolean;

	maxHeight?: number | string;
}

function FilterSelectCard<T>({
	title,
	options,
	value = [],
	onValueChange,

	getValue,
	getLabel,
	getDescription,
	getDisabled,

	allowAny = true,
	anyValue = "*",
	anyLabel = "Any",

	selectAll = true,

	searchable = true,
	searchPlaceholder = "Search...",

	loading = false,
	loadingMessage = "Loading...",

	emptyMessage = "No options found.",

	disabled = false,

	maxHeight = 190,
}: FilterSelectCardProps<T>) {
	const [search, setSearch] = useState("");

	const resolvedOptions = useMemo(
		() =>
			options.map((option) =>
				resolveOption(option, {
					getValue,
					getLabel,
					getDescription,
					getDisabled,
				}),
			),
		[options, getValue, getLabel, getDescription, getDisabled],
	);

	const filteredOptions = useMemo(() => {
		const query = search.trim().toLowerCase();

		if (!query) {
			return resolvedOptions;
		}

		return resolvedOptions.filter((option) =>
			String(option.label ?? "")
				.toLowerCase()
				.includes(query),
		);
	}, [resolvedOptions, search]);

	const selectedValues = Array.isArray(value) ? value : [];

	const isAnySelected = selectedValues.includes(anyValue);

	const enabledFilteredOptions = filteredOptions.filter(
		(option) => !option.disabled,
	);

	const allFilteredSelected =
		enabledFilteredOptions.length > 0 &&
		enabledFilteredOptions.every((option) =>
			selectedValues.includes(option.value),
		);

	const updateValue = (nextValue: string[]) => {
		onValueChange?.(nextValue);
	};

	const toggleValue = (optionValue: string) => {
		if (disabled) {
			return;
		}

		if (optionValue === anyValue) {
			updateValue(isAnySelected ? [] : [anyValue]);
			return;
		}

		const withoutAny = selectedValues.filter((item) => item !== anyValue);

		const nextValue = withoutAny.includes(optionValue)
			? withoutAny.filter((item) => item !== optionValue)
			: [...withoutAny, optionValue];

		updateValue(nextValue);
	};

	const toggleSelectAll = () => {
		if (disabled || loading || enabledFilteredOptions.length === 0) {
			return;
		}

		const filteredValues = new Set(
			enabledFilteredOptions.map((option) => option.value),
		);

		if (allFilteredSelected) {
			updateValue(selectedValues.filter((item) => !filteredValues.has(item)));

			return;
		}

		const nextValues = new Set(
			selectedValues.filter((item) => item !== anyValue),
		);

		for (const option of enabledFilteredOptions) {
			nextValues.add(option.value);
		}

		updateValue([...nextValues]);
	};

	return (
		<Card variant="outlined">
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					p: 2,
					pb: 1,
				}}
			>
				<Typography
  variant="subtitle2"
  sx={{
    fontWeight: 700,
    textTransform: "uppercase",
  }}
>
  {title}
</Typography>
				<Typography variant="caption" color="text.secondary">
					{isAnySelected ? "Any" : `${selectedValues.length} selected`}
				</Typography>
			</Box>

			{searchable && (
				<Box sx={{ px: 2, pb: 1 }}>
					<TextField
						size="small"
						fullWidth
						type="search"
						value={search}
						disabled={disabled}
						placeholder={searchPlaceholder}
						onChange={(event) => setSearch(event.target.value)}
					/>
				</Box>
			)}

			<Box sx={{ px: 2 }}>
				<Stack spacing={0.5}>
					{allowAny && (
						<FilterCheckboxRow
							label={anyLabel}
							checked={isAnySelected}
							disabled={disabled}
							onCheckedChange={() => toggleValue(anyValue)}
						/>
					)}

					{selectAll && (
						<FilterCheckboxRow
							label="Select all search results"
							checked={allFilteredSelected}
							disabled={
								disabled || loading || enabledFilteredOptions.length === 0
							}
							onCheckedChange={toggleSelectAll}
						/>
					)}
				</Stack>
			</Box>

			<Divider sx={{ mt: 1 }} />

			<Box
				sx={{
					maxHeight,
					overflowY: "auto",
					p: 2,
				}}
			>
				{loading ? (
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							minHeight: 80,
						}}
					>
						<Typography variant="caption" color="text.secondary">
							{loadingMessage}
						</Typography>
					</Box>
				) : filteredOptions.length === 0 ? (
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							minHeight: 80,
						}}
					>
						<Typography variant="caption" color="text.secondary">
							{emptyMessage}
						</Typography>
					</Box>
				) : (
					<Stack spacing={0.5}>
						{filteredOptions.map((option) => {
							const checked =
								!isAnySelected && selectedValues.includes(option.value);

							return (
								<FilterCheckboxRow
									key={option.value}
									label={option.label}
									description={option.description}
									checked={checked}
									disabled={disabled || option.disabled}
									onCheckedChange={() => toggleValue(option.value)}
								/>
							);
						})}
					</Stack>
				)}
			</Box>
		</Card>
	);
}

interface FilterCheckboxRowProps {
	label: ReactNode;
	description?: ReactNode;
	checked: boolean;
	disabled?: boolean;
	onCheckedChange: () => void;
}

function FilterCheckboxRow({
	label,
	description,
	checked,
	disabled,
	onCheckedChange,
}: FilterCheckboxRowProps) {
	return (
		<FormControlLabel
			disabled={disabled}
			control={<Checkbox checked={checked} onChange={onCheckedChange} />}
			label={
				<Box>
					<Typography variant="body2">{label}</Typography>

					{description && (
						<Typography variant="caption" color="text.secondary">
							{description}
						</Typography>
					)}
				</Box>
			}
		/>
	);
}

export { FilterSelectCard };

