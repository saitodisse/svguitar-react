/// <reference types="vitest" />
import { defineConfig, mergeConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const baseConfig = defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
		include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: ["src/components/ChordDiagram/**/*.{ts,tsx}", "src/index.ts"],
			exclude: [
				"**/*.test.{ts,tsx}",
				"**/*.spec.{ts,tsx}",
				"**/__tests__/**",
				"src/App.tsx",
				"src/main.tsx",
				"src/i18n.ts",
				"src/components/ui/**",
				"src/components/theme-provider.tsx",
				"src/lib/**",
				"src/stories/**",
				"src/locales/**",
				"dist/**",
				"dist-app/**",
				"node_modules/**",
				"*.config.{js,ts}",
				"*.setup.{js,ts}",
			],
			thresholds: {
				global: {
					branches: 80,
					functions: 80,
					lines: 80,
					statements: 80,
				},
			},
		},
	},
});

export default mergeConfig(
	baseConfig,
	defineConfig({
		test: {
			projects: [
				// Unit tests project
				{
					extends: true,
					test: {
						name: "unit",
						include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
						exclude: ["src/stories/**/*"],
						environment: "jsdom",
						globals: true,
						setupFiles: ["./vitest.setup.ts"],
					},
				},
				// Storybook tests project
				{
					extends: true,
					plugins: [
						storybookTest({
							// The location of your Storybook config, main.js|ts
							configDir: path.join(dirname, ".storybook"),
							// This should match your package.json script to run Storybook
							// The --ci flag will skip prompts and not open a browser
							storybookScript: "pnpm storybook:ci",
						}),
					],
					test: {
						name: "storybook",
						// Enable browser mode
						browser: {
							enabled: true,
							// Make sure to install Playwright
							provider: "playwright",
							headless: true,
							instances: [{ browser: "chromium" }],
						},
						setupFiles: ["./.storybook/vitest.setup.ts"],
					},
				},
			],
		},
	})
);
