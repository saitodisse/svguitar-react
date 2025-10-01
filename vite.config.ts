/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { fileURLToPath } from "node:url";
import path from "path";

// https://vite.dev/config/
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": resolve(dirname, "./src"),
		},
	},
	build: {
		lib: {
			entry: resolve(dirname, "src/index.ts"),
			name: "SvguitarReact",
			fileName: format => `index.${format === "es" ? "es.js" : "js"}`,
			formats: ["es", "cjs"],
		},
		rollupOptions: {
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
		emptyOutDir: false,
	},
	test: {
		projects: [
			{
				test: {
					name: "unit",
					environment: "jsdom",
					globals: true,
					setupFiles: ["./vitest.setup.ts"],
					include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
					exclude: ["src/stories/**/*"],
				},
			},
			{
				extends: true,
				plugins: [
					// The plugin will run tests for the stories defined in your Storybook config
					// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
					storybookTest({
						configDir: path.join(dirname, ".storybook"),
					}),
				],
				test: {
					name: "storybook",
					browser: {
						enabled: true,
						headless: true,
						provider: "playwright",
						instances: [
							{
								browser: "chromium",
							},
						],
					},
					setupFiles: [".storybook/vitest.setup.ts"],
				},
			},
		],
	},
});
