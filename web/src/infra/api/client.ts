// src/infra/api/client.ts

import axios from "axios";

import { normalizeError } from "./errors";

const http = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001/api",

	timeout: 15_000,

	headers: {
		"Content-Type": "application/json",
		"ngrok-skip-browser-warning": "true",
	},
});

/* -------------------------------------------------------------------------- */
/* Request                                                                    */
/* -------------------------------------------------------------------------- */

http.interceptors.request.use(
	(config) => {
		/*
		 * Current CarBravo Hono mock API uses a static Bearer token.
		 *
		 * Backend:
		 *   CARBRAVO_DEV_TOKEN=mock-token
		 *
		 * Frontend:
		 *   VITE_API_TOKEN=mock-token
		 */
		const accessToken = import.meta.env.VITE_API_TOKEN;

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => Promise.reject(error),
);

/* -------------------------------------------------------------------------- */
/* Response                                                                   */
/* -------------------------------------------------------------------------- */

http.interceptors.response.use(
	(response) => response,
	(error) => {
		/*
		 * The current mock API does not have refresh-token authentication.
		 *
		 * Therefore a 401 should simply be returned to the caller.
		 */
		return Promise.reject(normalizeError(error));
	},
);

export { http };
