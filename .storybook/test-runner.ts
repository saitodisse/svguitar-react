import type { TestRunnerConfig } from "@storybook/test-runner";

const config: TestRunnerConfig = {
	/**
	 * Hook that executes once before all tests run.
	 * Useful for global Node.js configurations (e.g., extending Jest expect).
	 */
	async setup() {
		// Execute whatever you like, in Node, once before all tests run
		console.log("Setting up Storybook Test Runner...");
	},

	/**
	 * Hook that executes within a test before the story renders.
	 * Useful for page-level setup (e.g., viewport size).
	 */
	async preVisit(page, _context) {
		// Execute before visiting the story
		await page.setViewportSize({ width: 1200, height: 800 });
	},

	/**
	 * Hook that executes within a test after the story renders.
	 * Useful for taking screenshots or DOM snapshots.
	 */
	async postVisit(page, _context) {
		// Execute after visiting the story
		// You can add custom assertions or take screenshots here
	},

	/**
	 * Configure log level for the test runner
	 * Options: 'info', 'warn', 'error', 'verbose', 'none'
	 */
	logLevel: "info",
};

export default config;
