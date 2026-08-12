import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv, type UserConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
		plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
		resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
		server: { port: Number(env.VITE_PORT) },
		build: { outDir: "dist" },
	};
});
