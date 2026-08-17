import type { Theme } from "@mui/material/styles";

/**
 * shadcn's shadow scale (Tailwind's xs/sm/md/lg/xl/2xl), flattened onto
 * MUI's fixed 25-entry `theme.shadows` array (index 0 must be "none";
 * indices 1-24 step up in elevation — MUI's own components like Paper/Card/
 * Dialog pick specific indices, which the component overrides below then
 * reference by name, e.g. `theme.shadows[8]` for a dialog).
 */
export function buildShadows(): Theme["shadows"] {
	const xs = "0 1px 2px 0 rgb(0 0 0 / 0.04)";
	const sm = "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)";
	const md =
		"0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)";
	const lg =
		"0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)";
	const xl =
		"0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)";
	const xxl = "0 25px 50px -12px rgb(0 0 0 / 0.25)";
	// index: 0     1   2   3   4   5-19  20-24
	return [
		"none",
		xs,
		sm,
		md,
		lg,
		...Array(15).fill(xl),
		...Array(5).fill(xxl),
	] as Theme["shadows"];
}
