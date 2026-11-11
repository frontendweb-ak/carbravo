// Local-only authentication for the replaceable Hono mock API.
// The Java/Spring Boot service will own real authentication and authorization.

import type { Context } from "hono";
import type { UserRole } from "../types/types.js";
import { ApiError } from "./errors.js";

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
}

const DEV_TOKEN = process.env.CARBRAVO_DEV_TOKEN ?? "mock-token";
const USER_ROLES: readonly UserRole[] = ["AUTHOR", "APPROVER", "ADMIN"];

export function currentUser(c: Context): AuthUser {
  // Never expose the development token/header-based role switch in production.
  if (process.env.NODE_ENV === "production") {
    throw new ApiError(
      503,
      "INTERNAL_SERVER_ERROR",
      "The Hono mock API is available only in local development",
    );
  }

  const authorization = c.req.header("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token || token !== DEV_TOKEN) {
    throw new ApiError(401, "UNAUTHORIZED", "Invalid access token");
  }

  const requestedRole = c.req.header("X-User-Role") ?? "AUTHOR";
  if (!USER_ROLES.includes(requestedRole as UserRole)) {
    throw new ApiError(401, "UNAUTHORIZED", "Invalid mock user role");
  }

  const username = c.req.header("X-User-Name")?.trim() || "demo.author";
  if (username.length > 80) {
    throw new ApiError(400, "VALIDATION_ERROR", "Mock user name is too long");
  }

  return {
    id: "mock-user-1",
    username,
    role: requestedRole as UserRole,
  };
}

export function requireRole(c: Context, ...roles: UserRole[]): AuthUser {
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
