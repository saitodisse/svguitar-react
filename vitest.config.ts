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
	},
});

export default mergeConfig(
	baseConfig,
	defineConfig({
		test: {
			projects: [
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
