// auth-storage.ts

import type { AuthSession } from "../session/auth-session.types";

const AUTH_SESSION_KEY = "carbravo.auth.session";

function readSession(): AuthSession | null {
	const raw = localStorage.getItem(AUTH_SESSION_KEY);

	if (!raw) {
		return null;
	}

	try {
		return JSON.parse(raw) as AuthSession;
	} catch {
		localStorage.removeItem(AUTH_SESSION_KEY);
		return null;
	}
}

function writeSession(session: AuthSession): void {
	localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

function clearSession(): void {
	localStorage.removeItem(AUTH_SESSION_KEY);
}

export const authStorage = {
	read: readSession,
	write: writeSession,
	clear: clearSession,
};
