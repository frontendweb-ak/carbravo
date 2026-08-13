import { format, formatDate, isValid, parseISO } from "date-fns";

export type DateValue = Date | string | number;

function toDate(value: DateValue): Date {
	if (value instanceof Date) {
		return value;
	}

	if (typeof value === "string") {
		return parseISO(value);
	}

	return new Date(value);
}

/**
 * Formats a date for headings and other long-form text.
 *
 * Example:
 * Thursday, August 13, 2026
 */
export function formatLongDate(value: DateValue): string {
	const date = toDate(value);

	if (!isValid(date)) {
		return "Invalid date";
	}

	return format(date, "EEEE, MMMM d, yyyy");
}

/**
 * Formats a date in a human-friendly relative format.
 *
 * Examples:
 * Just now
 * 5 minutes ago
 * 2 hours ago
 * 3 days ago
 * Aug 5, 2026
 */
export function formatRelativeTime(value: DateValue): string {
	const date = toDate(value);

	if (!isValid(date)) {
		return typeof value === "string" ? value : "Invalid date";
	}

	const diff = Date.now() - date.getTime();

	// Avoid showing negative relative times for future dates.
	if (diff < 0) {
		return "Just now";
	}

	const minutes = Math.floor(diff / 60_000);

	if (minutes < 1) {
		return "Just now";
	}

	if (minutes < 60) {
		return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
	}

	const hours = Math.floor(minutes / 60);

	if (hours < 24) {
		return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
	}

	const days = Math.floor(hours / 24);

	if (days < 7) {
		return `${days} ${days === 1 ? "day" : "days"} ago`;
	}

	return format(date, "MMM d, yyyy");
}

export function formatProgramDate(value: string | null) {
	if (!value) {
		return "—";
	}

	return formatDate(value, "MMM d, yyyy");
}
