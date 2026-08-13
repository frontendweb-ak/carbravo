// src/lib/auth.ts

import type { Context } from "hono";
import type { UserRole } from "../store.js";
import { ApiError } from "./errors.js";

export interface AuthUser {
	id: string;
	username: string;
	role: UserRole;
}

const DEV_TOKEN = process.env.CARBRAVO_DEV_TOKEN ?? "mock-token";

export function currentUser(c: Context): AuthUser {
	const authorization = c.req.header("Authorization");

	if (!authorization?.startsWith("Bearer ")) {
		throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
	}

	const token = authorization.slice("Bearer ".length);

	if (!token) {
		throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
	}

	// Temporary mock:
	// token validity is intentionally simple.
	if (token !== DEV_TOKEN) {
		throw new ApiError(401, "UNAUTHORIZED", "Invalid access token");
	}

	const role = (c.req.header("X-User-Role") as UserRole | undefined) ?? "ADMIN";

	const username = c.req.header("X-User-Name") ?? "demo.user";

	return {
		id: "mock-user-1",
		username,
		role,
	};
}

export function requireRole(c: Context, ...roles: UserRole[]) {
	const user = currentUser(c);

	if (!roles.includes(user.role)) {
		throw new ApiError(
			403,
			"FORBIDDEN",
			"You do not have permission to perform this operation",
		);
	}

	return user;
}
