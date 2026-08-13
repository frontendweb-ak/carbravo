// auth-session.types.ts

export type CarBravoRole = "AUTHOR" | "APPROVER" | "ADMIN";

export interface AuthUser {
	id: string;
	name?: string;
	email?: string;
}

export interface AuthSession {
	accessToken: string;
	refreshToken: string;
	user?: AuthUser;
	roles: CarBravoRole[];
	expiresAt?: number;
}
