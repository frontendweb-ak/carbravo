import {
	Combobox as ComboboxPrimitive,
	type ComboboxRootChangeEventDetails,
} from "@base-ui/react/combobox";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown, Loader2, X } from "lucide-react";
import { type ComponentProps, type ReactNode, useMemo, useState } from "react";

import {
	cn,
	type OptionGroupAccessors,
	type ResolvedOption,
	resolveOption,
} from "@/utils";
import { Select } from "./select-base";
import { SelectTrigger, type SelectTriggerProps } from "./select-trigger";

export type SelectValueProps = ComponentProps<typeof SelectPrimitive.Value>;

function SelectValue({
	placeholder = "Select an option",
	...props
}: SelectValueProps) {
	return <SelectPrimitive.Value placeholder={placeholder} {...props} />;
}

export type SelectContentProps = ComponentProps<typeof SelectPrimitive.Popup>;

function SelectContent({ className, children, ...props }: SelectContentProps) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Positioner sideOffset={4} className="z-50">
				<SelectPrimitive.Popup
					data-slot="select-content"
					className={cn(
						"min-w-(--anchor-width)",
						"max-h-80",
						"overflow-hidden",
						"rounded-md border",
						"bg-popover text-popover-foreground",
						"shadow-md",
						"outline-none",
						className,
					)}
					{...props}
				>
					{children}
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	);
}

export type SelectListProps = ComponentProps<typeof SelectPrimitive.List>;

function SelectList({ className, ...props }: SelectListProps) {
	return (
		<SelectPrimitive.List
			data-slot="select-list"
			className={cn("max-h-72 overflow-y-auto p-1", className)}
			{...props}
		/>
	);
}

export type SelectItemProps = ComponentProps<typeof SelectPrimitive.Item>;

function SelectItem({ className, children, ...props }: SelectItemProps) {
	return (
		<SelectPrimitive.Item
			data-slot="select-item"
			className={cn(
				"relative flex w-full cursor-pointer",
				"items-center gap-2",
				"rounded-sm px-2 py-2",
				"text-sm outline-none",

				"hover:bg-accent hover:text-accent-foreground",
				"focus:bg-accent focus:text-accent-foreground",

				"data-highlighted:bg-accent",
				"data-highlighted:text-accent-foreground",

				"data-disabled:pointer-events-none",
				"data-disabled:cursor-not-allowed",
				"data-disabled:opacity-50",

				className,
			)}
			{...props}
		>
			<span className="min-w-0 flex-1 truncate">{children}</span>

			<SelectPrimitive.ItemIndicator>
				<Check aria-hidden="true" className="size-4 shrink-0" />
			</SelectPrimitive.ItemIndicator>
		</SelectPrimitive.Item>
	);
}

export type SelectSearchProps = ComponentProps<typeof ComboboxPrimitive.Input>;

function SelectSearch({ className, ...props }: SelectSearchProps) {
	return (
		<ComboboxPrimitive.Input
			data-slot="select-search"
			className={cn(
				"h-9 w-full",
				"border-b border-input",
				"bg-background",
				"px-3",
				"text-sm",
				"outline-none",
				"placeholder:text-muted-foreground",
				"focus-visible:ring-2",
				"focus-visible:ring-ring/30",
				className,
			)}
			{...props}
		/>
	);
}

export interface SelectEmptyProps {
	children?: ReactNode;
}

function SelectEmpty({ children = "No options found." }: SelectEmptyProps) {
	return (
		<div
			data-slot="select-empty"
			className={cn(
				"px-3 py-6",
				"text-center text-sm",
				"text-muted-foreground",
			)}
		>
			{children}
		</div>
	);
}

export interface SelectLoadingProps {
	children?: ReactNode;
}

function SelectLoading({ children = "Loading..." }: SelectLoadingProps) {
	return (
		<div
			data-slot="select-loading"
			className={cn(
				"flex items-center justify-center gap-2",
				"px-3 py-6",
				"text-sm text-muted-foreground",
			)}
		>
			<Loader2 aria-hidden="true" className="size-4 animate-spin" />

			{children}
		</div>
	);
}

export type SelectValueType = "id" | "object";

export type SelectOutput<
	T,
	TValueType extends SelectValueType,
> = TValueType extends "object" ? T | null : string;

export interface SelectDataProps<
	T,
	TValueType extends SelectValueType = "id",
> extends OptionGroupAccessors<T> {
	options: T[];

	valueType?: TValueType;

	value?: TValueType extends "object" ? T | null : string;

	onValueChange?: (value: SelectOutput<T, TValueType>) => void;

	searchable?: boolean;

	searchValue?: string;

	onSearchChange?: (value: string) => void;

	loading?: boolean;

	emptyMessage?: ReactNode;

	loadingMessage?: ReactNode;

	disabled?: boolean;

	placeholder?: string;

	/**
	 * Props for the normal Select trigger.
	 *
	 * These are intentionally NOT passed to the
	 * Combobox input because Trigger props are
	 * HTMLButtonElement props.
	 */
	triggerProps?: SelectTriggerProps;

	/**
	 * Props specifically for the searchable input.
	 */
	searchInputProps?: Omit<
		ComponentProps<typeof ComboboxPrimitive.Input>,
		"value" | "onChange"
	>;

	className?: string;
}

/* -------------------------------------------------------------------------- */
/* Select Data                                                                  */
/* -------------------------------------------------------------------------- */

function SelectData<T, TValueType extends SelectValueType = "id">({
	options,

	valueType = "id" as TValueType,

	value,

	onValueChange,

	getValue,
	getLabel,
	getDescription,
	getDisabled,

	searchable = false,

	searchValue = "",
	onSearchChange,

	loading = false,

	emptyMessage = "No options found.",
	loadingMessage = "Loading...",

	disabled = false,

	placeholder = "Select an option",

	triggerProps,
	searchInputProps,

	className,
}: SelectDataProps<T, TValueType>) {
	const [internalSearch, setInternalSearch] = useState("");

	/*
	 * Controlled search:
	 *
	 * If onSearchChange exists:
	 *     parent controls search.
	 *
	 * Otherwise:
	 *     SelectData controls search locally.
	 */
	const search = onSearchChange ? searchValue : internalSearch;

	const resolvedOptions = useMemo<ResolvedOption<T>[]>(
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

	/* ---------------------------------------------------------------------- */
	/* Local filtering                                                         */
	/* ---------------------------------------------------------------------- */

	const visibleOptions = useMemo(() => {
		/*
		 * Server search:
		 *
		 * Parent is responsible for changing options.
		 */
		if (onSearchChange) {
			return resolvedOptions;
		}

		/*
		 * No search or search disabled.
		 */
		if (!searchable || !search.trim()) {
			return resolvedOptions;
		}

		const query = search.trim().toLowerCase();

		return resolvedOptions.filter((option) =>
			String(option.label ?? "")
				.toLowerCase()
				.includes(query),
		);
	}, [resolvedOptions, searchable, search, onSearchChange]);

	/* ---------------------------------------------------------------------- */
	/* Search change                                                            */
	/* ---------------------------------------------------------------------- */

	const handleSearchChange = (nextValue: string) => {
		if (onSearchChange) {
			onSearchChange(nextValue);
		} else {
			setInternalSearch(nextValue);
		}
	};

	/* ---------------------------------------------------------------------- */
	/* ID mode                                                                  */
	/* ---------------------------------------------------------------------- */

	const emitIdValue = (nextValue: string) => {
		onValueChange?.(nextValue as SelectOutput<T, TValueType>);
	};

	/* ---------------------------------------------------------------------- */
	/* Object mode                                                              */
	/* ---------------------------------------------------------------------- */

	const selectedObject = useMemo(() => {
		if (valueType !== "object") {
			return null;
		}

		if (value === null || value === undefined) {
			return null;
		}

		const objectValue = value as T;

		const objectId = getValue
			? getValue(objectValue)
			: resolveOption(objectValue, {}).value;

		return (
			resolvedOptions.find((option) => option.value === objectId)?.original ??
			objectValue
		);
	}, [valueType, value, getValue, resolvedOptions]);

	/* ---------------------------------------------------------------------- */
	/* Common selection                                                         */
	/* ---------------------------------------------------------------------- */

	const selectedId =
		valueType === "object"
			? selectedObject
				? resolveOption(selectedObject, {
						getValue,
						getLabel,
						getDescription,
						getDisabled,
					}).value
				: ""
			: String(value ?? "");

	const handleResolvedSelection = (option: ResolvedOption<T> | null) => {
		if (!option) {
			if (valueType === "object") {
				onValueChange?.(null as SelectOutput<T, TValueType>);
			} else {
				emitIdValue("");
			}

			return;
		}

		if (valueType === "object") {
			onValueChange?.(option.original as SelectOutput<T, TValueType>);
		} else {
			emitIdValue(option.value);
		}
	};

	/* ====================================================================== */
	/* SIMPLE SELECT                                                           */
	/* ====================================================================== */

	if (!searchable) {
		return (
			<Select
				value={selectedId}
				onValueChange={(nextValue) => {
					const selected = resolvedOptions.find(
						(option) => option.value === nextValue,
					);

					handleResolvedSelection(selected ?? null);
				}}
				disabled={disabled}
			>
				<SelectTrigger
					{...triggerProps}
					disabled={disabled}
					className={cn(className, triggerProps?.className)}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>

				<SelectContent>
					{loading ? (
						<SelectLoading>{loadingMessage}</SelectLoading>
					) : visibleOptions.length === 0 ? (
						<SelectEmpty>{emptyMessage}</SelectEmpty>
					) : (
						<SelectList>
							{visibleOptions.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}
									disabled={option.disabled}
								>
									<div className="flex min-w-0 flex-col">
										<span className="truncate">{option.label}</span>

										{option.description && (
											<span className="truncate text-xs text-muted-foreground">
												{option.description}
											</span>
										)}
									</div>
								</SelectItem>
							))}
						</SelectList>
					)}
				</SelectContent>
			</Select>
		);
	}

	/* ====================================================================== */
	/* SEARCHABLE SELECT / COMBOBOX                                           */
	/* ====================================================================== */

	const selectedComboboxValue =
		resolvedOptions.find((option) => option.value === selectedId) ?? null;

	return (
		<ComboboxPrimitive.Root
			items={resolvedOptions}
			value={selectedComboboxValue}
			onValueChange={(nextValue, _details: ComboboxRootChangeEventDetails) => {
				if (!nextValue) {
					handleResolvedSelection(null);
					return;
				}

				/*
				 * Because `items` contains ResolvedOption<T>,
				 * Base UI gives us the same object here.
				 */
				handleResolvedSelection(nextValue as ResolvedOption<T>);
			}}
			disabled={disabled}
			autoHighlight
		>
			<ComboboxPrimitive.InputGroup className="relative w-full">
				<ComboboxPrimitive.Input
					{...searchInputProps}
					disabled={disabled}
					placeholder={placeholder}
					value={search}
					onChange={(event) => {
						handleSearchChange(event.target.value);
					}}
					className={cn(
						"h-9 w-full",
						"rounded-md border border-input",
						"bg-background",
						"px-3 pr-16",
						"text-sm text-foreground",
						"shadow-xs",
						"outline-none",

						"placeholder:text-muted-foreground",

						"hover:border-ring/60",

						"focus-visible:border-ring",
						"focus-visible:ring-3",
						"focus-visible:ring-ring/30",

						"disabled:cursor-not-allowed",
						"disabled:opacity-50",

						className,
						searchInputProps?.className,
					)}
				/>

				<ComboboxPrimitive.Trigger
					aria-label="Open options"
					className={cn(
						"absolute right-0 top-0",
						"flex h-9 w-9",
						"items-center justify-center",
						"text-muted-foreground",
						"outline-none",
					)}
				>
					<ChevronDown aria-hidden="true" className="size-4" />
				</ComboboxPrimitive.Trigger>

				<ComboboxPrimitive.Clear
					aria-label="Clear selection"
					className={cn(
						"absolute right-8 top-0",
						"flex h-9 w-9",
						"items-center justify-center",
						"text-muted-foreground",
					)}
				>
					<X aria-hidden="true" className="size-4" />
				</ComboboxPrimitive.Clear>
			</ComboboxPrimitive.InputGroup>

			<ComboboxPrimitive.Portal>
				<ComboboxPrimitive.Positioner sideOffset={4} className="z-50">
					<ComboboxPrimitive.Popup
						className={cn(
							"min-w-(--anchor-width)",
							"max-h-80",
							"overflow-hidden",
							"rounded-md border",
							"bg-popover",
							"text-popover-foreground",
							"shadow-md",
							"outline-none",
						)}
					>
						{loading ? (
							<SelectLoading>{loadingMessage}</SelectLoading>
						) : visibleOptions.length === 0 ? (
							<SelectEmpty>{emptyMessage}</SelectEmpty>
						) : (
							<ComboboxPrimitive.List className="max-h-72 overflow-y-auto p-1">
								{visibleOptions.map((option) => (
									<ComboboxPrimitive.Item
										key={option.value}
										value={option}
										disabled={option.disabled}
										className={cn(
											"relative flex w-full cursor-pointer",
											"items-center gap-2",
											"rounded-sm px-2 py-2",
											"text-sm outline-none",

											"hover:bg-accent hover:text-accent-foreground",

											"data-highlighted:bg-accent",
											"data-highlighted:text-accent-foreground",

											"data-disabled:pointer-events-none",
											"data-disabled:cursor-not-allowed",
											"data-disabled:opacity-50",
										)}
									>
										<span className="min-w-0 flex-1">
											<span className="block truncate">{option.label}</span>

											{option.description && (
												<span className="block truncate text-xs text-muted-foreground">
													{option.description}
												</span>
											)}
										</span>

										<ComboboxPrimitive.ItemIndicator>
											<Check aria-hidden="true" className="size-4 shrink-0" />
										</ComboboxPrimitive.ItemIndicator>
									</ComboboxPrimitive.Item>
								))}
							</ComboboxPrimitive.List>
						)}
					</ComboboxPrimitive.Popup>
				</ComboboxPrimitive.Positioner>
			</ComboboxPrimitive.Portal>
		</ComboboxPrimitive.Root>
	);
}

export {
	SelectContent,
	SelectData,
	SelectEmpty,
	SelectItem,
	SelectList,
	SelectLoading,
	SelectSearch,
	SelectTrigger,
	SelectValue,
};
