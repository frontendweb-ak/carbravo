import path from "node:path";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type UserConfig } from "vite";
// https://vite.dev/config/
export default defineConfig(({ mode }): UserConfig => {
	const env = loadEnv(mode, process.cwd(), "");
	return {
		plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve(import.meta.dirname, "./src"),
			},
		},
		server: { port: Number(env.VITE_PORT) },
		build: { outDir: "dist" },
	};
});
