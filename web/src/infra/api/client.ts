// src/infra/api/client.ts

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { authSession } from "@/features/auth";
import { normalizeError } from "./errors";
import { refreshAccessToken } from "./refresh";

type RetryableRequest = InternalAxiosRequestConfig & {
	_retry?: boolean;
};

const http = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001/api",
	timeout: 15_000,
	headers: {
		"Content-Type": "application/json",
		"ngrok-skip-browser-warning": "true",
	},
});

http.interceptors.request.use(
	(config) => {
		const accessToken =
			authSession.getAccessToken() || import.meta.env.VITE_API_TOKEN;

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => Promise.reject(error),
);

http.interceptors.response.use(
	(response) => response,

	async (error: AxiosError) => {
		const originalRequest = error.config as RetryableRequest | undefined;

		if (!originalRequest) return Promise.reject(normalizeError(error));

		if (error.response?.status !== 401) {
			return Promise.reject(normalizeError(error));
		}

		/*
		 * Never retry a request more than once.
		 */
		if (originalRequest._retry) {
			return Promise.reject(normalizeError(error));
		}

		const authorization = originalRequest.headers?.Authorization;

		if (!authorization) {
			return Promise.reject(normalizeError(error));
		}

		originalRequest._retry = true;

		try {
			const newAccessToken = await refreshAccessToken();

			/*
			 * Update the failed request.
			 */
			originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

			/*
			 * Retry using the same configured client.
			 */
			return http(originalRequest);
		} catch (refreshError) {
			return Promise.reject(normalizeError(refreshError));
		}
	},
);

export { http };

