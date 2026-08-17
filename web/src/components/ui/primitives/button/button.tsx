// src/components/ui/primitives/button/button.tsx

import MuiButton, {
    type ButtonProps as MuiButtonProps,
} from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "outline"
	| "ghost"
	| "danger"
	| "success";

export interface ButtonProps
	extends Omit<MuiButtonProps, "variant" | "color"> {
	variant?: ButtonVariant;
	loading?: boolean;
}

const variantMap: Record<
	ButtonVariant,
	{
		variant: MuiButtonProps["variant"];
		color: MuiButtonProps["color"];
	}
> = {
	primary: {
		variant: "contained",
		color: "primary",
	},
	secondary: {
		variant: "contained",
		color: "secondary",
	},
	outline: {
		variant: "outlined",
		color: "primary",
	},
	ghost: {
		variant: "text",
		color: "primary",
	},
	danger: {
		variant: "contained",
		color: "error",
	},
	success: {
		variant: "contained",
		color: "success",
	},
};

function Button({
	variant = "primary",
	loading = false,
	disabled,
	children,
	startIcon,
	...props
}: ButtonProps) {
	const config = variantMap[variant];

	return (
		<MuiButton
			{...props}
			variant={config.variant}
			color={config.color}
			disabled={disabled || loading}
			startIcon={
				loading ? (
					<CircularProgress
						size={16}
						color="inherit"
					/>
				) : (
					startIcon
				)
			}
		>
			{children}
		</MuiButton>
	);
}

export { Button };

