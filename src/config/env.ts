import { z } from "zod";

const envSchema = z.object({
	VITE_APP_NAME: z.string().min(1),
	VITE_APP_ENV: z.enum(["development", "test", "staging", "production"]),
	VITE_APP_VERSION: z.string().min(1),
	VITE_API_URL: z.url(),
	VITE_ENABLE_API_MOCKS: z.enum(["true", "false"]).transform((value) => value === "true"),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
	console.error("Invalid application environment configuration:", parsedEnv.error);

	throw new Error(
		"Invalid application environment configuration. Check your VITE_* environment variables.",
	);
}

export const env = {
	appName: parsedEnv.data.VITE_APP_NAME,
	environment: parsedEnv.data.VITE_APP_ENV,
	version: parsedEnv.data.VITE_APP_VERSION,
	apiUrl: parsedEnv.data.VITE_API_URL,
	enableApiMocks: parsedEnv.data.VITE_ENABLE_API_MOCKS,
} as const;
