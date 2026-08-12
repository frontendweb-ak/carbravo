export type InputTransform = "none" | "uppercase" | "lowercase" | "capitalize";
export function transformValue(
	value: string,
	transform: InputTransform,
): string {
	switch (transform) {
		case "uppercase":
			return value.toUpperCase();

		case "lowercase":
			return value.toLowerCase();

		case "capitalize":
			return value.replace(/\b\w/g, (char) => char.toUpperCase());

		default:
			return value;
	}
}
export type InputParseMode = "number" | "decimal" | "phone";
export function parseInputValue(
	value: string,
	parseMode: InputParseMode = "number",
): string {
	switch (parseMode) {
		case "number":
			return value.replace(/\D/g, "");

		case "decimal":
			return value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");

		case "phone":
			return value.replace(/\D/g, "");

		default:
			return value;
	}
}
