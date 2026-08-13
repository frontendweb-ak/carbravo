import { Checkbox } from "@/components/ui";
import { cn, type OptionGroupAccessors, resolveOption } from "@/utils";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

export interface FilterSelectCardProps<T> extends OptionGroupAccessors<T> {
	title: ReactNode;

	options: T[];

	value?: string[];

	onValueChange?: (value: string[]) => void;

	/**
	 * Show the wildcard option.
	 *
	 * Example:
	 * * Any Model
	 */
	allowAny?: boolean;

	/**
	 * Internal wildcard value.
	 */
	anyValue?: string;

	/**
	 * Wildcard display label.
	 */
	anyLabel?: ReactNode;

	/**
	 * Show "Select all search results".
	 */
	selectAll?: boolean;

	searchable?: boolean;

	searchPlaceholder?: string;

	loading?: boolean;

	loadingMessage?: ReactNode;

	emptyMessage?: ReactNode;

	disabled?: boolean;

	maxHeight?: number | string;

	className?: string;
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

	className,
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

		/**
		 * Wildcard.
		 *
		 * Selecting "*" clears normal selections.
		 */
		if (optionValue === anyValue) {
			updateValue(isAnySelected ? [] : [anyValue]);

			return;
		}

		/**
		 * Selecting a real option removes wildcard.
		 */
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
		<div
			className={cn(
				"flex min-w-0 flex-col",
				"rounded-xl border border-border",
				"bg-card",
				className,
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between gap-2 px-3 pt-3">
				<span className="truncate text-xs font-bold uppercase tracking-wide text-foreground">
					{title}
				</span>

				<span className="shrink-0 text-xs font-semibold text-muted-foreground">
					{isAnySelected ? "Any" : `${selectedValues.length} selected`}
				</span>
			</div>

			{/* Search */}
			{searchable && (
				<div className="px-3 pt-2.5">
					<input
						type="search"
						value={search}
						disabled={disabled}
						placeholder={searchPlaceholder}
						onChange={(event) => setSearch(event.target.value)}
						className={cn(
							"h-8 w-full",
							"rounded-lg border border-input",
							"bg-transparent px-2.5",
							"text-sm text-foreground",
							"outline-none",

							"placeholder:text-muted-foreground",

							"focus:border-ring",
							"focus:ring-2",
							"focus:ring-ring/20",

							"disabled:cursor-not-allowed",
							"disabled:opacity-50",
						)}
					/>
				</div>
			)}

			{/* Selection controls */}
			<div className="px-3 pt-2">
				{allowAny && (
					<FilterCheckboxRow
						label={anyLabel}
						checked={isAnySelected}
						disabled={disabled}
						bold
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
			</div>

			{/* Divider */}
			<div className="mx-3 mt-2 border-t border-border" />

			{/* Options */}
			<div className="overflow-y-auto px-3 py-2" style={{ maxHeight }}>
				{loading ? (
					<div className="flex min-h-20 items-center justify-center text-xs text-muted-foreground">
						{loadingMessage}
					</div>
				) : filteredOptions.length === 0 ? (
					<div className="flex min-h-20 items-center justify-center text-xs text-muted-foreground">
						{emptyMessage}
					</div>
				) : (
					<div className="space-y-1">
						{filteredOptions.map((option) => {
							const checked =
								!isAnySelected && selectedValues.includes(option.value);

							const optionDisabled = disabled || option.disabled;

							return (
								<FilterCheckboxRow
									key={option.value}
									label={option.label}
									description={option.description}
									checked={checked}
									disabled={optionDisabled}
									onCheckedChange={() => toggleValue(option.value)}
								/>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

interface FilterCheckboxRowProps {
	label: ReactNode;

	description?: ReactNode;

	checked: boolean;

	disabled?: boolean;

	bold?: boolean;

	onCheckedChange: () => void;
}

function FilterCheckboxRow({
	label,
	description,
	checked,
	disabled = false,
	bold = false,
	onCheckedChange,
}: FilterCheckboxRowProps) {
	return (
		<label
			className={cn(
				"flex min-w-0 items-start gap-2",
				"rounded-md px-1 py-1",
				disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
			)}
		>
			<Checkbox
				checked={checked}
				disabled={disabled}
				onCheckedChange={(nextChecked) => {
					if (nextChecked === checked) {
						return;
					}
					onCheckedChange();
				}}
			/>

			<div className="min-w-0 flex-1">
				<div
					className={cn("truncate text-sm leading-5", bold && "font-semibold")}
				>
					{label}
				</div>

				{description && (
					<div className="truncate text-xs text-muted-foreground">
						{description}
					</div>
				)}
			</div>
		</label>
	);
}

export { FilterSelectCard };
