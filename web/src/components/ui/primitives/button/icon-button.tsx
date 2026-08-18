// src/components/ui/primitives/icon-button/icon-button.tsx

import CircularProgress from "@mui/material/CircularProgress";
import MuiIconButton, {
    type IconButtonProps as MuiIconButtonProps,
} from "@mui/material/IconButton";
import type { ReactNode } from "react";

export type IconButtonProps = Omit<
	MuiIconButtonProps,
	"children"
> & {
	/**
	 * Icon rendered inside the button.
	 */
	children?: ReactNode;

	/**
	 * Shows a loading indicator and disables the button.
	 */
	loading?: boolean;
};

function IconButton({
	children,
	loading = false,
	disabled = false,
	...props
}: IconButtonProps) {
	return (
		<MuiIconButton
			{...props}
			disabled={disabled || loading}
			aria-busy={loading || undefined}
		>
			{loading ? (
				<CircularProgress
					size={18}
					color="inherit"
				/>
			) : (
				children
			)}
		</MuiIconButton>
	);
}

export { IconButton };

