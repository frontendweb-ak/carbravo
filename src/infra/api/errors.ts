import axios from "axios";

export type AppErrorKind =
	| "validation"
	| "auth"
	| "network"
	| "server"
	| "unknown";

export interface AppError {
	kind: AppErrorKind;
	code: string;
	message: string;
	details?: unknown;
	fieldErrors?: Record<string, string[]>;
	statusCode?: number;
}

interface ApiErrorBody {
	success?: false;
	error?: {
		code?: string;
		message?: string;
		details?: unknown;
		fields?: Record<string, string[]>;
	};
}

function kindForStatus(status: number): AppErrorKind {
	if (status === 401 || status === 403) {
		return "auth";
	}

	if (status === 400 || status === 422) {
		return "validation";
	}

	if (status >= 500) {
		return "server";
	}

	return "unknown";
}

export function normalizeError(error: unknown): AppError {
	/* ---------------------------------------------------------------------- */
	/* Axios error                                                            */
	/* ---------------------------------------------------------------------- */

	if (axios.isAxiosError(error)) {
		/*
		 * No HTTP response means:
		 * - network failure
		 * - timeout
		 * - DNS failure
		 * - server unreachable
		 */
		if (!error.response) {
			return {
				kind: "network",
				code: "NETWORK_UNREACHABLE",
				message: "Unable to reach the server. Check your internet connection.",
			};
		}

		const status = error.response.status;

		const body = error.response.data as ApiErrorBody | undefined;

		/*
		 * Standard CarBravo API error envelope.
		 */
		if (body?.success === false && body.error) {
			return {
				kind: kindForStatus(status),
				code: body.error.code ?? "UNKNOWN_API_ERROR",
				message: body.error.message ?? "An unexpected error occurred.",
				details: body.error.details,
				fieldErrors: body.error.fields,
				statusCode: status,
			};
		}

		/*
		 * API returned an error but not our expected envelope.
		 */
		return {
			kind: kindForStatus(status),
			code: "UNKNOWN_ERROR_SHAPE",
			message: error.message || "An unexpected error occurred.",
			statusCode: status,
		};
	}

	/* ---------------------------------------------------------------------- */
	/* Already normalized                                                     */
	/* ---------------------------------------------------------------------- */

	if (isAppError(error)) {
		return error;
	}

	/* ---------------------------------------------------------------------- */
	/* Native Error                                                           */
	/* ---------------------------------------------------------------------- */

	if (error instanceof Error) {
		return {
			kind: "unknown",
			code: "UNKNOWN",
			message: error.message,
		};
	}

	/* ---------------------------------------------------------------------- */
	/* Unknown                                                                */
	/* ---------------------------------------------------------------------- */

	return {
		kind: "unknown",
		code: "UNKNOWN",
		message: "An unexpected error occurred.",
	};
}

export function isAppError(error: unknown): error is AppError {
	return (
		typeof error === "object" &&
		error !== null &&
		"kind" in error &&
		"code" in error &&
		"message" in error
	);
}
