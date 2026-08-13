// src/features/auth/mock-auth.ts

import { authSession } from "./auth-session";

export function setupMockAuth() {
	if (!import.meta.env.DEV) {
		return;
	}

	if (authSession.isAuthenticated()) {
		return;
	}

	authSession.set({
		accessToken: "mock-access-token",
		refreshToken: "mock-refresh-token",
		roles: ["ADMIN"],
		user: {
			id: "mock-admin",
			name: "CarBravo Admin",
			email: "admin@carbravo.local",
		},
		expiresAt: Date.now() + 15 * 60 * 1000,
	});
}
