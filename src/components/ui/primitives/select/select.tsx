import { cn, type OptionGroupAccessors, resolveOption } from "@/utils";
import {
	Combobox as ComboboxPrimitive,
	type ComboboxRootChangeEventDetails,
} from "@base-ui/react/combobox";
import {
	Select as SelectPrimitive,
	type SelectRootChangeEventDetails,
} from "@base-ui/react/select";
import { Check, ChevronDown, Loader2, X } from "lucide-react";
import { type ComponentProps, type ReactNode, useMemo, useState } from "react";

/* -------------------------------------------------------------------------- */
/* Select                                                                      */
/* -------------------------------------------------------------------------- */

export type SelectProps = Omit<
	ComponentProps<typeof SelectPrimitive.Root>,
	"value" | "defaultValue" | "onValueChange"
> & {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
};

function Select({ value, defaultValue, onValueChange, ...props }: SelectProps) {
	return (
		<SelectPrimitive.Root
			{...props}
			value={value}
			defaultValue={defaultValue}
			onValueChange={(nextValue, _details: SelectRootChangeEventDetails) => {
				onValueChange?.(String(nextValue ?? ""));
			}}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* Select Trigger                                                              */
/* -------------------------------------------------------------------------- */

export type SelectTriggerProps = ComponentProps<typeof SelectPrimitive.Trigger>;

function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
	return (
		<SelectPrimitive.Trigger
			data-slot="select-trigger"
			className={cn(
				"flex h-9 w-full items-center justify-between gap-2",
				"rounded-md border border-input",
				"bg-background px-3",
				"text-sm text-foreground",
				"shadow-xs",
				"outline-none",

				"hover:border-ring/60",

				"focus-visible:border-ring",
				"focus-visible:ring-3",
				"focus-visible:ring-ring/30",

				"disabled:pointer-events-none",
				"disabled:cursor-not-allowed",
				"disabled:opacity-50",

				"aria-invalid:border-destructive",
				"aria-invalid:ring-3",
				"aria-invalid:ring-destructive/20",

				"dark:bg-input/30",

				className,
			)}
			{...props}
		>
			<span className="min-w-0 flex-1 truncate text-left">{children}</span>

			<ChevronDown
				aria-hidden="true"
				className="size-4 shrink-0 text-muted-foreground"
			/>
		</SelectPrimitive.Trigger>
	);
}

/* -------------------------------------------------------------------------- */
/* Select Value                                                                */
/* -------------------------------------------------------------------------- */

export type SelectValueProps = ComponentProps<typeof SelectPrimitive.Value>;

function SelectValue({
	placeholder = "Select an option",
	...props
}: SelectValueProps) {
	return <SelectPrimitive.Value placeholder={placeholder} {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Select Content                                                              */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Select List                                                                 */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Select Item                                                                 */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Combobox Input                                                              */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Empty                                                                       */
/* -------------------------------------------------------------------------- */

export interface SelectEmptyProps {
	children?: ReactNode;
}

function SelectEmpty({ children = "No options found." }: SelectEmptyProps) {
	return (
		<div
			data-slot="select-empty"
			className="px-3 py-6 text-center text-sm text-muted-foreground"
		>
			{children}
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                     */
/* -------------------------------------------------------------------------- */

export interface SelectLoadingProps {
	children?: ReactNode;
}

function SelectLoading({ children = "Loading..." }: SelectLoadingProps) {
	return (
		<div
			data-slot="select-loading"
			className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted-foreground"
		>
			<Loader2 aria-hidden="true" className="size-4 animate-spin" />

			{children}
		</div>
	);
}

/**
 * Select data component
 */
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
	triggerProps?: SelectTriggerProps;
	className?: string;
}

function SelectData<T>({
	options,
	value,
	onValueChange,

	valueType = "id",
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
	className,
}: SelectDataProps<T>) {
	const [internalSearch, setInternalSearch] = useState("");

	const isServerSearch = Boolean(onSearchChange);
	const search = onSearchChange ? searchValue : internalSearch;

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

	const visibleOptions = useMemo(() => {
		if (onSearchChange) return resolvedOptions;
		if (!searchable || !search.trim()) return resolvedOptions;
		const query = search.trim().toLowerCase();
		return resolvedOptions.filter((option) =>
			String(option.label ?? "")
				.toLowerCase()
				.includes(query),
		);
	}, [resolvedOptions, searchable, search, onSearchChange]);
	const handleSearchChange = (nextValue: string) => {
		if (onSearchChange) {
			onSearchChange(nextValue);
		} else {
			setInternalSearch(nextValue);
		}
	};
	if (!searchable) {
		return (
			<Select value={value} onValueChange={onValueChange} disabled={disabled}>
				<SelectTrigger
					{...triggerProps}
					disabled={disabled}
					className={className}
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

	/*
	 * Searchable select = Combobox.
	 */
	return (
		<ComboboxPrimitive.Root
			items={visibleOptions}
			value={resolvedOptions.find((option) => option.value === value) ?? null}
			onValueChange={(nextValue, _details: ComboboxRootChangeEventDetails) => {
				if (!nextValue) {
					onValueChange?.("");
					return;
				}

				const resolved = resolveOption(nextValue as T, {});

				onValueChange?.(resolved.value);
			}}
			disabled={disabled}
			autoHighlight
		>
			<ComboboxPrimitive.InputGroup className="relative w-full">
				<ComboboxPrimitive.Input
					id={triggerProps?.id}
					aria-invalid={triggerProps?.["aria-invalid"]}
					disabled={disabled}
					placeholder={placeholder}
					className={cn(
						"h-9 w-full",
						"rounded-md border border-input",
						"bg-background px-3 pr-9",
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
							"bg-popover text-popover-foreground",
							"shadow-md",
							"outline-none",
						)}
					>
						{loading ? (
							<SelectLoading>{loadingMessage}</SelectLoading>
						) : visibleOptions.length === 0 ? (
							<ComboboxPrimitive.Empty>
								<SelectEmpty>{emptyMessage}</SelectEmpty>
							</ComboboxPrimitive.Empty>
						) : (
							<ComboboxPrimitive.List className="max-h-72 overflow-y-auto p-1">
								{(option) => (
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
								)}
							</ComboboxPrimitive.List>
						)}
					</ComboboxPrimitive.Popup>
				</ComboboxPrimitive.Positioner>
			</ComboboxPrimitive.Portal>
		</ComboboxPrimitive.Root>
	);
}

/* -------------------------------------------------------------------------- */
/* Exports                                                                     */
/* -------------------------------------------------------------------------- */

export {
	Select,
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
