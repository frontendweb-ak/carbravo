import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// 1. Base Axios Instance
export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "https://api.example.com/v1",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer mock-token",
	},
});

// Queue management for multiple concurrent requests during token refresh
let isRefreshing = false;
let failedQueue: Array<{
	resolve: (token: string) => void;
	reject: (err: AxiosError) => void;
}> = [];

const processQueue = (
	error: AxiosError | null,
	token: string | null = null,
) => {
	failedQueue.forEach((promise) => {
		if (error) {
			promise.reject(error);
		} else if (token) {
			promise.resolve(token);
		}
	});
	failedQueue = [];
};

// 2. Request Interceptor: Attach Auth Token
api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = localStorage.getItem("access_token");
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: AxiosError) => Promise.reject(error),
);

// 3. Response Interceptor: Silent Token Refresh & Retry
api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		// If 401 Unauthorized and request hasn't been retried yet
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${token}`;
						}
						return api(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshToken = localStorage.getItem("refresh_token");
				const { data } = await axios.post(
					`${api.defaults.baseURL}/auth/refresh`,
					{
						refreshToken,
					},
				);

				const newAccessToken = data.accessToken;
				localStorage.setItem("access_token", newAccessToken);

				processQueue(null, newAccessToken);

				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				}

				return api(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError as AxiosError, null);
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");
				window.location.href = "/login"; // Redirect to auth
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);
