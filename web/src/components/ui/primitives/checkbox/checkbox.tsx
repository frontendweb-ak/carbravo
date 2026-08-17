// src/components/ui/primitives/checkbox/checkbox.tsx

import MuiCheckbox, {
	type CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";

import { forwardRef } from "react";

export interface CheckboxProps extends MuiCheckboxProps {}

const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>((props, ref) => (
	<MuiCheckbox ref={ref} size="small" disableRipple {...props} />
));

Checkbox.displayName = "Checkbox";

export { Checkbox };
