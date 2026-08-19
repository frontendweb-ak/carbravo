import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { useTheme, type SxProps, type Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

export type ChoiceChipColor =
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "error"
	| "info";

export type ChoiceChipVariant = "outlined" | "soft";

export interface ChoiceChipOption<T> {
	label: ReactNode;
	value: T;
}

export interface ChoiceChipGroupProps<T> {
	options: ChoiceChipOption<T>[];
	value?: T | T[] | null;
	onChange?: (value: T | T[] | null) => void;
	selectionMode?: "single" | "multiple";
	color?: ChoiceChipColor;
	variant?: ChoiceChipVariant;
	disabled?: boolean;
	showCheck?: boolean;

	/**
	 * Visual configuration
	 */
	borderRadius?: number | string;
	minHeight?: number;
	paddingX?: number | string;
	fontSize?: number | string;
	fontWeight?: number;
	gap?: number;
	sx?: SxProps<Theme>;
}

function ChoiceChipGroup<T>({
	options,
	value,
	onChange,
	selectionMode = "single",
	color = "primary",
	variant = "outlined",
	disabled = false,
	showCheck,
	borderRadius = 1,
	minHeight = 34,
	paddingX = 4,
	fontSize = "0.8125rem",
	fontWeight = 600,
	gap = 2,
	sx,
}: ChoiceChipGroupProps<T>) {
	const theme = useTheme();
	const isMultiple = selectionMode === "multiple";
	const selectedValues = isMultiple ? (Array.isArray(value) ? value : []) : [];
	const shouldShowCheck = showCheck ?? isMultiple;
	const isSelected = (optionValue: T) => {
		if (isMultiple) {
			return selectedValues.some(
				(selectedValue) => selectedValue === optionValue,
			);
		}
		return value === optionValue;
	};

	const getColor = () => {
		switch (color) {
			case "secondary":
				return theme.palette.secondary.main;
			case "success":
				return theme.palette.success.main;
			case "warning":
				return theme.palette.warning.main;
			case "error":
				return theme.palette.error.main;
			case "info":
				return theme.palette.info.main;
			default:
				return theme.palette.primary.main;
		}
	};

	const selectedColor = getColor();

	const handleClick = (optionValue: T) => {
		if (disabled) return;

		if (isMultiple) {
			const current = selectedValues;
			const exists = current.some(
				(selectedValue) => selectedValue === optionValue,
			);
			const next = exists
				? current.filter((selectedValue) => selectedValue !== optionValue)
				: [...current, optionValue];
			onChange?.(next);
			return;
		}

		onChange?.(value === optionValue ? null : optionValue);
	};

	return (
		<Box
			role="group"
			sx={[
				{
					display: "flex",
					flexWrap: "wrap",
					gap,
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}
		>
			{options.map((option) => {
				const selected = isSelected(option.value);

				return (
					<ButtonBase
						key={String(option.value)}
						type="button"
						disabled={disabled}
						onClick={() => handleClick(option.value)}
						aria-pressed={selected}
						sx={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							minHeight,
							paddingInline: paddingX,
							border: "1px solid",
							borderRadius,
							borderColor: selected ? selectedColor : theme.palette.divider,
							backgroundColor:
								selected && variant === "soft"
									? `color-mix(in srgb, ${selectedColor} 10%, ${theme.palette.background.paper})`
									: theme.palette.background.paper,
							color: selected ? selectedColor : theme.palette.text.secondary,
							fontFamily: theme.typography.fontFamily,
							fontSize,
							fontWeight,
							lineHeight: 1,
							whiteSpace: "nowrap",
							transition: theme.transitions.create(
								["background-color", "border-color", "color"],
								{
									duration: 120,
								},
							),
							"&:hover": {
								borderColor: selectedColor,
								backgroundColor:
									variant === "soft"
										? `color-mix(in srgb, ${selectedColor} 6%, ${theme.palette.background.paper})`
										: theme.palette.action.hover,
							},
							"&:focus-visible": {
								outline: `2px solid ${selectedColor}`,
								outlineOffset: 2,
							},
							"&.Mui-disabled": {
								opacity: 0.5,
							},
						}}
					>
						{selected && shouldShowCheck && (
							<CheckIcon sx={{ fontSize: 15, mr: 0.5 }} />
						)}

						{option.label}
					</ButtonBase>
				);
			})}
		</Box>
	);
}

export { ChoiceChipGroup };

