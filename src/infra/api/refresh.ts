// src/infra/api/refresh.ts

import axios from "axios";

import { authSession } from "@/features/auth";

interface MockRefreshResponse {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
}

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
	if (refreshPromise) {
		return refreshPromise;
	}

	refreshPromise = performRefresh();

	refreshPromise.finally(() => {
		refreshPromise = null;
	});

	return refreshPromise;
}

async function performRefresh(): Promise<string> {
	const session = authSession.get();

	if (!session?.refreshToken) {
		authSession.clear();

		throw new Error("No refresh token available");
	}

	try {
		/*
		 * IMPORTANT:
		 *
		 * Use plain axios here.
		 *
		 * Do NOT use `http`, otherwise the refresh
		 * request itself will enter the 401 interceptor.
		 */
		const response = await axios.post<MockRefreshResponse>(
			`${getApiBaseUrl()}/auth/refresh`,
			{
				refreshToken: session.refreshToken,
			},
		);

		const data = response.data;

		if (!data.accessToken) {
			throw new Error("Mock refresh response missing access token");
		}

		authSession.set({
			...session,

			accessToken: data.accessToken,

			refreshToken: data.refreshToken ?? session.refreshToken,

			expiresAt: Date.now() + data.expiresIn * 1000,
		});

		return data.accessToken;
	} catch (error) {
		authSession.clear();

		throw error;
	} finally {
		refreshPromise = null;
	}
}

function getApiBaseUrl(): string {
	return import.meta.env.VITE_API_URL ?? "http://localhost:4010/api/v1";
}
