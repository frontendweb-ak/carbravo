import type { AuthSession, CarBravoRole } from "./auth-session.types";

import { authStorage } from "./auth-storage";

let session: AuthSession | null = authStorage.read();

function getSession(): AuthSession | null {
	return session;
}

function getAccessToken(): string | null {
	return session?.accessToken ?? null;
}

function getRefreshToken(): string | null {
	return session?.refreshToken ?? null;
}

function getRoles(): CarBravoRole[] {
	return session?.roles ?? [];
}

function hasRole(role: CarBravoRole): boolean {
	return session?.roles.includes(role) ?? false;
}

function hasAnyRole(roles: CarBravoRole[]): boolean {
	return roles.some((role) => session?.roles.includes(role));
}

function setSession(nextSession: AuthSession): void {
	session = nextSession;
	authStorage.write(nextSession);
}

function updateSession(update: Partial<AuthSession>): void {
	if (!session) {
		throw new Error("Cannot update missing auth session");
	}

	session = {
		...session,
		...update,
	};

	authStorage.write(session);
}

function clearSession(): void {
	session = null;
	authStorage.clear();
}

function isAuthenticated(): boolean {
	if (!session?.accessToken) {
		return false;
	}

	if (session.expiresAt !== undefined && Date.now() >= session.expiresAt) {
		return false;
	}

	return true;
}

function isAccessTokenExpired(bufferMs = 30_000): boolean {
	const expiresAt = session?.expiresAt;

	if (!expiresAt) {
		return false;
	}

	return Date.now() >= expiresAt - bufferMs;
}

export const authSession = {
	get: getSession,

	getAccessToken,
	getRefreshToken,

	getRoles,
	hasRole,
	hasAnyRole,

	set: setSession,
	update: updateSession,
	clear: clearSession,

	isAuthenticated,
	isAccessTokenExpired,
};
