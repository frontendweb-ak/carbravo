// src/lib/errors.ts

export class ApiError extends Error {
	constructor(
		public readonly status: number,
		public readonly code: string,
		message: string,
		public readonly details: Record<string, unknown> = {},
	) {
		super(message);
	}
}

export function badRequest(
	code: string,
	message: string,
	details: Record<string, unknown> = {},
) {
	return new ApiError(400, code, message, details);
}

export function conflict(
	code: string,
	message: string,
	details: Record<string, unknown> = {},
) {
	return new ApiError(409, code, message, details);
}

export function notFound(code: string, message: string) {
	return new ApiError(404, code, message);
}
